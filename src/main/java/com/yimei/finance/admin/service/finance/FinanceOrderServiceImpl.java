package com.yimei.finance.admin.service.finance;

import com.yimei.finance.admin.repository.company.AdminCompanyRepository;
import com.yimei.finance.admin.repository.finance.*;
import com.yimei.finance.admin.representation.finance.enums.EnumAdminFinanceError;
import com.yimei.finance.admin.representation.finance.enums.EnumFinanceAttachment;
import com.yimei.finance.admin.representation.finance.enums.EnumFinanceStatus;
import com.yimei.finance.admin.representation.finance.enums.FinanceSMSMessage;
import com.yimei.finance.admin.representation.finance.object.*;
import com.yimei.finance.common.representation.enums.EnumCommonError;
import com.yimei.finance.common.representation.file.AttachmentObject;
import com.yimei.finance.common.representation.result.Result;
import com.yimei.finance.common.service.message.MessageServiceImpl;
import com.yimei.finance.common.service.tools.NumberServiceImpl;
import com.yimei.finance.entity.admin.company.Company;
import com.yimei.finance.entity.admin.finance.*;
import com.yimei.finance.exception.BusinessException;
import com.yimei.finance.utils.CodeUtils;
import com.yimei.finance.utils.DozerUtils;
import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Attachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service("adminFinanceOrderService")
public class FinanceOrderServiceImpl {
    @Autowired
    private AdminFinanceOrderRepository adminFinanceOrderRepository;
    @Autowired
    private AdminFinanceOrderSalesmanRepository salesmanRepository;
    @Autowired
    private AdminFinanceOrderInvestigatorRepository investigatorRepository;
    @Autowired
    private AdminFinanceOrderSupervisorRepository supervisorRepository;
    @Autowired
    private AdminFinanceOrderRiskRepository riskRepository;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private MessageServiceImpl messageService;
    @Autowired
    private AdminFinanceOrderContractRepository contractRepository;
    @Autowired
    private NumberServiceImpl numberService;
    @Autowired
    private AdminCompanyRepository adminCompanyRepository;

    public List<AttachmentObject> getAttachmentByFinanceIdType(Long financeId, EnumFinanceAttachment attachment) {
        List<HistoricTaskInstance> taskList = historyService.createHistoricTaskInstanceQuery().processInstanceBusinessKey(String.valueOf(financeId)).taskDefinitionKey(attachment.type).orderByTaskCreateTime().desc().list();
        if (taskList == null || taskList.size() == 0) throw new BusinessException(EnumCommonError.Admin_System_Error);
        List<Attachment> attachments = taskService.getTaskAttachments(taskList.get(0).getId());
        if (attachments == null || attachments.size() == 0) return null;
        return DozerUtils.copy(attachments, AttachmentObject.class);
    }

    public List<AttachmentObject> getAttachmentByFinanceIdType(Long financeId, EnumFinanceAttachment attachment, String type) {
        List<HistoricTaskInstance> taskList = historyService.createHistoricTaskInstanceQuery().processInstanceBusinessKey(String.valueOf(financeId)).taskDefinitionKey(attachment.type).orderByTaskCreateTime().desc().list();
        if (taskList == null || taskList.size() == 0) throw new BusinessException(EnumCommonError.Admin_System_Error);
        List<Attachment> attachmentList = taskService.getTaskAttachments(taskList.get(0).getId());
        if (attachmentList == null || attachmentList.size() == 0) return null;
        attachmentList = attachmentList.parallelStream().filter(a -> a.getType().equals(type)).collect(Collectors.toList());
        return DozerUtils.copy(attachmentList, AttachmentObject.class);
    }

    public List<AttachmentObject> getAttachmentByFinanceIdType(Long financeId, List<EnumFinanceAttachment> attachmentList) {
        List<AttachmentObject> attachmentObjectList = new ArrayList<>();
        attachmentList.stream()
                .forEach(attachment -> {
                    List<HistoricTaskInstance> tasks = historyService.createHistoricTaskInstanceQuery().processInstanceBusinessKey(String.valueOf(financeId)).taskDefinitionKey(attachment.type).list();
                    attachmentObjectList.addAll(DozerUtils.copy(tasks.stream().flatMap(task -> taskService.getTaskAttachments(task.getId()).stream()).collect(Collectors.toList()), AttachmentObject.class));
                });
        return attachmentObjectList;
    }

    /**
     * 获取金融申请单详细
     */
    public Result findById(Long id, EnumFinanceAttachment attachment, Long sessionCompanyId) {
        FinanceOrderObject financeOrderObject = DozerUtils.copy(adminFinanceOrderRepository.findOne(id), FinanceOrderObject.class);
        if (financeOrderObject == null) return Result.error(EnumAdminFinanceError.此金融单不存在.toString());
        if (sessionCompanyId.longValue() != 0 && (sessionCompanyId.longValue() != financeOrderObject.getRiskCompanyId().longValue()))
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        financeOrderObject.setAttachmentList1(getAttachmentByFinanceIdType(id, attachment));
        if (financeOrderObject.getRiskCompanyId() != null && financeOrderObject.getRiskCompanyId().longValue() != 0) {
            Company company = adminCompanyRepository.findOne(financeOrderObject.getRiskCompanyId());
            if (company != null) financeOrderObject.setRiskCompanyName(company.getName());
        }
        return Result.success().setData(financeOrderObject);
    }

    /**
     * 获取业务员填写信息详细
     */
    public Result findSalesmanInfoByFinanceId(Long financeId, EnumFinanceAttachment attachmentType, Long sessionCompanyId) {
        if (adminFinanceOrderRepository.findRiskCompanyIdById(financeId).longValue() != sessionCompanyId.longValue())
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        FinanceOrderSalesmanInfoObject salesmanInfoObject = DozerUtils.copy(salesmanRepository.findByFinanceId(financeId), FinanceOrderSalesmanInfoObject.class);
        if (salesmanInfoObject != null) {
            salesmanInfoObject.setAttachmentList1(getAttachmentByFinanceIdType(financeId, attachmentType));
        }
        return Result.success().setData(salesmanInfoObject);
    }

    /**
     * 获取尽调员填写信息详细
     */
    public Result findInvestigatorInfoByFinanceId(Long financeId, EnumFinanceAttachment attachmentType, List<EnumFinanceAttachment> typeList2, Long sessionCompanyId) {
        if (adminFinanceOrderRepository.findRiskCompanyIdById(financeId).longValue() != sessionCompanyId.longValue())
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        FinanceOrderInvestigatorInfoObject investigatorInfoObject = DozerUtils.copy(investigatorRepository.findByFinanceId(financeId), FinanceOrderInvestigatorInfoObject.class);
        if (investigatorInfoObject != null) {
            investigatorInfoObject.setAttachmentList1(getAttachmentByFinanceIdType(financeId, attachmentType));
            investigatorInfoObject.setAttachmentList2(getAttachmentByFinanceIdType(financeId, typeList2));
        }
        return Result.success().setData(investigatorInfoObject);
    }

    /**
     * 获取监管员填写信息详细
     */
    public Result findSupervisorInfoByFinanceId(Long financeId, EnumFinanceAttachment attachmentType, List<EnumFinanceAttachment> typeList2, Long sessionCompanyId) {
        if (adminFinanceOrderRepository.findRiskCompanyIdById(financeId).longValue() != sessionCompanyId.longValue())
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        FinanceOrderSupervisorInfoObject supervisorInfoObject = DozerUtils.copy(supervisorRepository.findByFinanceId(financeId), FinanceOrderSupervisorInfoObject.class);
        if (supervisorInfoObject != null) {
            supervisorInfoObject.setAttachmentList1(getAttachmentByFinanceIdType(financeId, attachmentType));
            supervisorInfoObject.setAttachmentList2(getAttachmentByFinanceIdType(financeId, typeList2));
        }
        return Result.success().setData(supervisorInfoObject);
    }

    /**
     * 获取风控人员填写信息详细
     */
    public Result findRiskManagerInfoByFinanceId(Long financeId, EnumFinanceAttachment attachment, List<EnumFinanceAttachment> attachmentList, Long sessionCompanyId) {
        if (adminFinanceOrderRepository.findRiskCompanyIdById(financeId).longValue() != sessionCompanyId.longValue())
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        FinanceOrderRiskManagerInfoObject riskManagerInfoObject = DozerUtils.copy(riskRepository.findByFinanceId(financeId), FinanceOrderRiskManagerInfoObject.class);
        if (riskManagerInfoObject != null) {
            riskManagerInfoObject.setAttachmentList1(getAttachmentByFinanceIdType(financeId, attachment, EnumFinanceAttachment.RiskManagerAuditAttachment.toString()));
            riskManagerInfoObject.setAttachmentList2(getAttachmentByFinanceIdType(financeId, attachmentList));
            riskManagerInfoObject.setAttachmentList3(getAttachmentByFinanceIdType(financeId, attachment, EnumFinanceAttachment.Upstream_Contract_Attachment.toString()));
            riskManagerInfoObject.setAttachmentList4(getAttachmentByFinanceIdType(financeId, attachment, EnumFinanceAttachment.Downstream_Contract_Attachment.toString()));
        }
        return Result.success().setData(riskManagerInfoObject);
    }

    /**
     * 获取合同
     */
    public Result findFinanceOrderRiskManagerContractByFinanceIdAndType(Long financeId, int type, Long sessionCompanyId) {
        if (adminFinanceOrderRepository.findRiskCompanyIdById(financeId).longValue() != sessionCompanyId.longValue())
            return Result.error(EnumAdminFinanceError.你没有权限查看此金融单.toString());
        FinanceOrderContractObject financeOrderContractObject = DozerUtils.copy(contractRepository.findByFinanceIdAndType(financeId, type), FinanceOrderContractObject.class);
        return Result.success().setData(financeOrderContractObject);
    }

    /**
     * 交易员补充材料
     */
    public void updateFinanceOrderByOnlineTrader(String userId, FinanceOrderObject financeOrder) {
        financeOrder.setLastUpdateManId(userId);
        financeOrder.setLastUpdateTime(new Date());
        adminFinanceOrderRepository.save(DozerUtils.copy(financeOrder, FinanceOrder.class));
    }

    /**
     * 保存,更新 业务员 填写的信息
     */
    public void saveFinanceOrderSalesmanInfo(String userId, FinanceOrderSalesmanInfoObject salesmanInfo) {
        FinanceOrderSalesmanInfo salesmanOrder = salesmanRepository.findByFinanceId(salesmanInfo.getFinanceId());
        salesmanInfo.setId(null);
        if (salesmanOrder != null) {
            salesmanInfo.setId(salesmanOrder.getId());
        }
        salesmanInfo.setLastUpdateManId(userId);
        salesmanInfo.setLastUpdateTime(new Date());
        salesmanRepository.save(DozerUtils.copy(salesmanInfo, FinanceOrderSalesmanInfo.class));
    }

    /**
     * 保存,更新 尽调员 填写的信息
     */
    public void saveFinanceOrderInvestigatorInfo(String userId, FinanceOrderInvestigatorInfoObject investigatorInfo) {
        FinanceOrderInvestigatorInfo investigatorOrder = investigatorRepository.findByFinanceId(investigatorInfo.getFinanceId());
        investigatorInfo.setId(null);
        if (investigatorOrder != null) {
            investigatorInfo.setId(investigatorOrder.getId());
        }
        investigatorInfo.setLastUpdateManId(userId);
        investigatorInfo.setLastUpdateTime(new Date());
        investigatorRepository.save(DozerUtils.copy(investigatorInfo, FinanceOrderInvestigatorInfo.class));
    }

    /**
     * 保存,更新 监管员 填写的信息
     */
    public void saveFinanceOrderSupervisorInfo(String userId, FinanceOrderSupervisorInfoObject supervisorInfo) {
        FinanceOrderSupervisorInfo supervisorOrder = supervisorRepository.findByFinanceId(supervisorInfo.getFinanceId());
        supervisorInfo.setId(null);
        if (supervisorOrder != null) {
            supervisorInfo.setId(supervisorOrder.getId());
        }
        supervisorInfo.setLastUpdateManId(userId);
        supervisorInfo.setLastUpdateTime(new Date());
        supervisorRepository.save(DozerUtils.copy(supervisorInfo, FinanceOrderSupervisorInfo.class));
    }

    /**
     * 保存,更新 风控 填写的信息
     */
    public void saveFinanceOrderRiskManagerInfo(String userId, FinanceOrderRiskManagerInfoObject riskManagerInfo) {
        FinanceOrderRiskManagerInfo riskManagerOrder = riskRepository.findByFinanceId(riskManagerInfo.getFinanceId());
        riskManagerInfo.setId(null);
        if (riskManagerOrder != null) {
            riskManagerInfo.setId(riskManagerOrder.getId());
            riskManagerInfo.setUpstreamContractStatus(riskManagerOrder.getUpstreamContractStatus());
            riskManagerInfo.setDownstreamContractStatus(riskManagerOrder.getDownstreamContractStatus());
        }
        riskManagerInfo.setLastUpdateManId(userId);
        riskManagerInfo.setLastUpdateTime(new Date());
        riskRepository.save(DozerUtils.copy(riskManagerInfo, FinanceOrderRiskManagerInfo.class));
    }

    public void changeFinanceOrderRiskManagerInfoContractStatus(String userId, Long financeId, int type, int status) {
        FinanceOrderRiskManagerInfo riskManagerInfo = riskRepository.findByFinanceId(financeId);
        if (riskManagerInfo == null) {
            riskManagerInfo = new FinanceOrderRiskManagerInfo();
            riskManagerInfo.setFinanceId(financeId);
            riskManagerInfo.setCreateManId(userId);
            riskManagerInfo.setCreateTime(new Date());
        }
        riskManagerInfo.setLastUpdateManId(userId);
        riskManagerInfo.setLastUpdateTime(new Date());
        if (type == 1) {
            riskManagerInfo.setUpstreamContractStatus(status);
        } else if (type == 2) {
            riskManagerInfo.setDownstreamContractStatus(status);
        }
        riskRepository.save(riskManagerInfo);
    }

    /**
     * 保存,更新 金融单 合同
     */
    public void saveFinanceOrderContract(String userId, FinanceOrderContractObject financeOrderContract) {
        FinanceOrderContract orderContract = contractRepository.findByFinanceIdAndType(financeOrderContract.getFinanceId(), financeOrderContract.getType());
        FinanceOrder financeOrder = adminFinanceOrderRepository.findOne(financeOrderContract.getFinanceId());
        financeOrderContract.setFinanceType(financeOrder.getApplyType());
        financeOrderContract.setFinanceSourceId(financeOrder.getSourceId());
        financeOrderContract.setApplyUserId(financeOrder.getUserId());
        financeOrderContract.setApplyUserName(financeOrder.getApplyUserName());
        financeOrderContract.setApplyUserPhone(financeOrder.getApplyUserPhone());
        financeOrderContract.setApplyCompanyId(financeOrder.getApplyCompanyId());
        financeOrderContract.setApplyCompanyName(financeOrder.getApplyCompanyName());
        financeOrderContract.setId(null);
        if (orderContract != null) {
            financeOrderContract.setId(orderContract.getId());
            financeOrderContract.setContractNo(orderContract.getContractNo());
        } else {
            financeOrderContract.setContractNo(numberService.generateContractNo(CodeUtils.GeneratePinYinCode(financeOrderContract.getBuyerCompanyName(), 4, true) + "-" + CodeUtils.GeneratePinYinCode(financeOrderContract.getSellerCompanyName(), 4, true)));
        }
        financeOrderContract.setLastUpdateManId(userId);
        financeOrderContract.setLastUpdateTime(new Date());
        contractRepository.save(DozerUtils.copy(financeOrderContract, FinanceOrderContract.class));
    }

    /**
     * 更改金融单状态
     */
    @Transactional
    public Result updateFinanceOrderApproveState(Long financeId, EnumFinanceStatus status, String userId) {
        FinanceOrder financeOrder = adminFinanceOrderRepository.findOne(financeId);
        if (financeOrder == null) throw new BusinessException(EnumCommonError.Admin_System_Error);
        FinanceOrder order = adminFinanceOrderRepository.findOne(financeId);
        order.setApproveStateId(status.id);
        order.setApproveState(status.name);
        order.setLastUpdateTime(new Date());
        order.setLastUpdateManId(userId);
        if (status.id == EnumFinanceStatus.AuditPass.id) {
            order.setEndTime(new Date());
            if (!StringUtils.isEmpty(financeOrder.getApplyUserPhone())) {
                messageService.sendSMS(financeOrder.getApplyUserPhone(), FinanceSMSMessage.getUserAuditPassMessage(financeOrder.getSourceId()));
            }
        }
        if (status.id == EnumFinanceStatus.AuditNotPass.id) {
            order.setEndTime(new Date());
            if (!StringUtils.isEmpty(financeOrder.getApplyUserPhone())) {
                messageService.sendSMS(financeOrder.getApplyUserPhone(), FinanceSMSMessage.getUserAuditNotPassMessage(financeOrder.getSourceId()));
            }
        }
        adminFinanceOrderRepository.save(order);
        return Result.success();
    }


}
