package com.yimei.finance.controllers.admin.restfulapi.user;

import com.yimei.finance.config.session.AdminSession;
import com.yimei.finance.entity.admin.finance.*;
import com.yimei.finance.entity.admin.user.EnumAdminUserError;
import com.yimei.finance.entity.admin.user.EnumSpecialGroup;
import com.yimei.finance.entity.common.enums.EnumCommonError;
import com.yimei.finance.entity.common.result.Page;
import com.yimei.finance.entity.common.result.Result;
import com.yimei.finance.service.admin.workflow.WorkFlowServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.engine.*;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.IdentityLink;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Api(tags = {"admin-api-flow"}, description = "金融公用接口")
@RequestMapping("/api/financing/admin/tasks")
@RestController("adminUserCenterController")
public class UserCenterController {
    @Autowired
    private IdentityService identityService;
    @Autowired
    private AdminSession adminSession;
    @Autowired
    private TaskService taskService;
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private WorkFlowServiceImpl workFlowService;
    @Autowired
    private ProcessEngine processEngine;
    @Autowired
    private RepositoryService repositoryService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    @ApiOperation(value = "个人待办任务列表", notes = "个人待办任务列表", response = TaskObject.class, responseContainer = "List")
    @ApiImplicitParam(name = "page", value = "当前页数", required = false, dataType = "Integer", paramType = "query")
    public Result getPersonalTasksMethod(Page page) {
        Result result = workFlowService.changeTaskObject(taskService.createTaskQuery().taskAssignee(adminSession.getUser().getId()).active().orderByTaskCreateTime().desc().listPage(page.getOffset(), page.getCount()));
        if (!result.isSuccess()) return result;
        List<TaskObject> taskList = (List<TaskObject>) result.getData();
        page.setTotal(taskService.createTaskQuery().taskAssignee(adminSession.getUser().getId()).count());
        return Result.success().setData(taskList).setMeta(page);
    }

    @RequestMapping(value = "/unclaimed", method = RequestMethod.GET)
    @ApiOperation(value = "给分配管理员查看待领取任务列表", notes = "给线上交易员管理组, 业务员管理组, 尽调员管理组, 监管员管理组, 风控管理组, 查看待领取任务列表", response = TaskObject.class, responseContainer = "List")
    @ApiImplicitParam(name = "page", value = "当前页数", required = false, dataType = "Integer", paramType = "query")
    public Result getPersonalWaitClaimTasksMethod(Page page) {
        List<Group> groupList = identityService.createGroupQuery().groupMember(adminSession.getUser().getId()).list();
        List<String> groupIds = new ArrayList<>();
        for (Group group : groupList) {
            groupIds.add(group.getId());
        }
        if (groupIds != null && groupIds.size() != 0) {
            page.setTotal(taskService.createTaskQuery().taskCandidateGroupIn(groupIds).active().count());
            Result result = workFlowService.changeTaskObject(taskService.createTaskQuery().taskCandidateGroupIn(groupIds).active().orderByTaskCreateTime().desc().listPage(page.getOffset(), page.getCount()));
            if (!result.isSuccess()) return result;
            List<TaskObject> taskList = (List<TaskObject>) result.getData();
            return Result.success().setData(taskList).setMeta(page);
        }
        return Result.success().setData(null).setMeta(page);
    }

    @RequestMapping(value = "/history", method = RequestMethod.GET)
    @ApiOperation(value = "个人已处理任务列表", notes = "个人已处理任务列表", response = HistoryTaskObject.class, responseContainer = "List")
    @ApiImplicitParam(name = "page", value = "当前页数", required = false, dataType = "Integer", paramType = "query")
    public Result getPersonalHistoryTasksMethod(Page page) {
        Result result = workFlowService.changeHistoryTaskObject(historyService.createHistoricTaskInstanceQuery().taskAssignee(adminSession.getUser().getId()).finished().orderByTaskCreateTime().desc().listPage(page.getOffset(), page.getCount()));
        if (!result.isSuccess()) return result;
        List<HistoryTaskObject> taskList = (List<HistoryTaskObject>) result.getData();
        return Result.success().setData(taskList);
    }

    @RequestMapping(value = "/{taskId}", method = RequestMethod.POST)
    @ApiOperation(value = "管理员领取任务", notes = "管理员领取任务操作", response = Boolean.class)
    @ApiImplicitParam(name = "taskId", value = "任务id", required = true, dataType = "String", paramType = "path")
    public Result onlineTraderManagerClaimTaskMethod(@PathVariable(value = "taskId") String taskId) {
        Task task = taskService.createTaskQuery().taskId(taskId).active().singleResult();
        if (task == null) return Result.error(EnumAdminFinanceError.此任务不存在或者已经完成.toString());
        if (!StringUtils.isEmpty(task.getAssignee())) {
            if (task.getAssignee().equals(adminSession.getUser().getId())) {
                return Result.error(EnumAdminFinanceError.你已经领取此任务.toString());
            } else {
                return Result.error(EnumAdminFinanceError.此任务已经被其他人领取.toString());
            }
        }
        List<IdentityLink> identityLinkList = taskService.getIdentityLinksForTask(task.getId());
        List<Group> groupList = identityService.createGroupQuery().groupMember(adminSession.getUser().getId()).list();
        for (IdentityLink identityLink : identityLinkList) {
            for (Group group : groupList) {
                if (identityLink.getGroupId().equals(group.getId())) {
                    taskService.claim(task.getId(), adminSession.getUser().getId());
                    return Result.success().setData(true);
                }
            }
        }
        return Result.error(EnumAdminFinanceError.你没有权限领取此任务.toString());
    }


    @RequestMapping(value = "/{taskId}/trader/{userId}", method = RequestMethod.PUT)
    @ApiOperation(value = "管理员分配人员", notes = "管理员分配人员操作")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "taskId", value = "任务id", required = true, dataType = "String", paramType = "path"),
            @ApiImplicitParam(name = "userId", value = "被分配人userId", required = true, dataType = "String", paramType = "path")
    })
    public Result assignMYROnlineTraderMethod(@PathVariable(value = "taskId") String taskId,
                                              @PathVariable(value = "userId") String userId) {
        Task task = taskService.createTaskQuery().taskId(taskId).active().singleResult();
        if (task == null) return Result.error(EnumAdminFinanceError.你没有权限处理此任务或者你已经处理过.toString());
        User user = identityService.createUserQuery().userId(userId).singleResult();
        if (user == null) return Result.error(EnumAdminUserError.此用户不存在.toString());
        ExecutionEntity execution = (ExecutionEntity) runtimeService.createExecutionQuery().executionId(task.getExecutionId()).singleResult();
        if (execution == null || StringUtils.isEmpty(execution.getActivityId()))
            return Result.error(EnumCommonError.Admin_System_Error);
        List<User> userList = new ArrayList<>();
        String financeEventType = "";
        if (execution.getActivityId().equals(EnumFinanceAssignType.assignOnlineTrader.toString())) {
            userList = identityService.createUserQuery().memberOfGroup(EnumSpecialGroup.OnlineTraderGroup.id).list();
            financeEventType = EnumFinanceEventType.onlineTraderAudit.toString();
        } else if (execution.getActivityId().equals(EnumFinanceAssignType.assignSalesman.toString())) {
            userList = identityService.createUserQuery().memberOfGroup(EnumSpecialGroup.SalesmanGroup.id).list();
            financeEventType = EnumFinanceEventType.salesmanAudit.toString();
        } else if (execution.getActivityId().equals(EnumFinanceAssignType.assignInvestigator.toString())) {
            userList = identityService.createUserQuery().memberOfGroup(EnumSpecialGroup.InvestigatorGroup.id).list();
            financeEventType = EnumFinanceEventType.investigatorAudit.toString();
        } else if (execution.getActivityId().equals(EnumFinanceAssignType.assignSupervisor.toString())) {
            userList = identityService.createUserQuery().memberOfGroup(EnumSpecialGroup.SupervisorGroup.id).list();
            financeEventType = EnumFinanceEventType.supervisorAudit.toString();
        } else if (execution.getActivityId().equals(EnumFinanceAssignType.assignRiskManager.toString())) {
            userList = identityService.createUserQuery().memberOfGroup(EnumSpecialGroup.RiskGroup.id).list();
            financeEventType = EnumFinanceEventType.riskManagerAudit.toString();
        } else {
            return Result.error(EnumCommonError.Admin_System_Error);
        }
        for (User u : userList) {
            if (u.getId().equals(userId)) {
                taskService.complete(task.getId());
                List<Task> taskList = taskService.createTaskQuery().processInstanceId(task.getProcessInstanceId()).active().list();
                for (Task t : taskList) {
                    Execution exe = runtimeService.createExecutionQuery().executionId(t.getExecutionId()).singleResult();
                    if (exe.getActivityId().equals(financeEventType)) {
                        taskService.setAssignee(t.getId(), userId);
                        return Result.success().setData(true);
                    } else {
                        return Result.error(EnumCommonError.Admin_System_Error);
                    }
                }
            }
        }
        return Result.error(EnumAdminFinanceError.该用户没有处理此金融单的权限.toString());
    }

    @RequestMapping(value = "/image/{processInstanceId}", method = RequestMethod.GET)
    @ApiOperation(value = "通过流程实例id获取流程图", notes = "通过流程实例id获取流程图")
    @ApiImplicitParam(name = "processInstanceId", value = "流程实例id", required = true, dataType = "String", paramType = "path")
    public void gene(@PathVariable("processInstanceId") String processInstanceId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("image/gif");
        OutputStream out = response.getOutputStream();
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
        InputStream is = processEngine.getProcessEngineConfiguration().getProcessDiagramGenerator()
                .generateDiagram(bpmnModel, "png", runtimeService.getActiveActivityIds(processInstance.getId()));
        ByteArrayOutputStream bytestream = new ByteArrayOutputStream();
        int len = 0;
        while ((len = is.read()) != -1) {
            bytestream.write(len);
        }
        byte[] b = bytestream.toByteArray();
        bytestream.close();
        out.write(b);
        out.flush();
    }


}
