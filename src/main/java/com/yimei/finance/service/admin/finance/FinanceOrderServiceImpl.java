package com.yimei.finance.service.admin.finance;

import com.yimei.finance.entity.admin.finance.AttachmentObject;
import com.yimei.finance.entity.admin.finance.FinanceOrder;
import com.yimei.finance.repository.admin.finance.FinanceOrderRepository;
import com.yimei.finance.representation.admin.finance.EnumFinanceEventType;
import com.yimei.finance.representation.admin.finance.EnumFinanceStatus;
import com.yimei.finance.representation.common.result.Page;
import com.yimei.finance.representation.common.result.Result;
import com.yimei.finance.representation.site.user.FinanceOrderSearch;
import com.yimei.finance.utils.DozerUtils;
import com.yimei.finance.utils.Where;
import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Attachment;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service("financeOrderService")
public class FinanceOrderServiceImpl {
    @Autowired
    private FinanceOrderRepository orderRepository;
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private TaskService taskService;

    /**
     * 交易员补充材料
     */
    @Transactional
    public void updateFinanceOrderByOnlineTrader(FinanceOrder financeOrder) {
        FinanceOrder order = orderRepository.findOne(financeOrder.getId());
        order.setFinancingAmount(financeOrder.getFinancingAmount());
        order.setExpectDate(financeOrder.getExpectDate());
        order.setBusinessAmount(financeOrder.getBusinessAmount());
        order.setTransportMode(financeOrder.getTransportMode());
        order.setProcurementPrice(financeOrder.getProcurementPrice());
        order.setContractor(financeOrder.getContractor());
        order.setDownstreamContractor(financeOrder.getDownstreamContractor());
        order.setTerminalServer(financeOrder.getTerminalServer());
        order.setComments(financeOrder.getComments());
        order.setCoalQuantityIndex(financeOrder.getCoalQuantityIndex());
        order.setApproveStateId(EnumFinanceStatus.Auditing.id);
        order.setApproveState(EnumFinanceStatus.Auditing.name);
        orderRepository.save(order);
    }

    /**
     * 查询金融单
     */
    public Result getFinanceOrderBySelect(int userId, FinanceOrderSearch order, Page page) {
        String hql = " select o from FinanceOrder o where o.userId=:userId ";
        if (order != null) {
            if (!StringUtils.isEmpty(order.getStartDate()) && !StringUtils.isEmpty(order.getEndDate())) {
                hql += " and o.createTime between :startDate and :endDate ";
            }

            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            System.out.println(" --------------------------- " + order.toString());
            if (order.getApproveStateId() != 0) {
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                System.out.println(" ----------------------------------- approveState " + (order.getApproveStateId() != 0));
                hql += " and o.approveStateId=:approveStateId ";
            }
            if (!StringUtils.isEmpty(order.getSourceId())) {
                System.out.println(" ----------------------------------- sourceId " + (!StringUtils.isEmpty(order.getSourceId())));
                System.out.println(" ----------------------------------- sourceId " + (!StringUtils.isEmpty(order.getSourceId())));
                System.out.println(" ----------------------------------- sourceId " + (!StringUtils.isEmpty(order.getSourceId())));
                System.out.println(" ----------------------------------- sourceId " + (!StringUtils.isEmpty(order.getSourceId())));
                System.out.println(" ----------------------------------- sourceId " + (!StringUtils.isEmpty(order.getSourceId())));
                hql += " and o.sourceId like :sourceId ";
            }
            if (!StringUtils.isEmpty(order.getApplyType())) {
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                System.out.println(" ----------------------------------- applyType " + (!StringUtils.isEmpty(order.getApplyType())));
                hql += " and o.applyType=:applyType ";
            }
        }

        TypedQuery<FinanceOrder> query = entityManager.createQuery(hql, FinanceOrder.class);
        query.setParameter("userId", userId);
        if (order != null) {
            if (!StringUtils.isEmpty(order.getStartDate()) && !StringUtils.isEmpty(order.getEndDate())) {
                query.setParameter("startDate", Date.valueOf(order.getStartDate()));
                query.setParameter("endDate", Date.valueOf(LocalDate.parse(order.getEndDate()).plusDays(1)));
            }
            if (order.getApproveStateId() != 0) {
                query.setParameter("approveStateId", order.getApproveStateId());
            }
            if (!StringUtils.isEmpty(order.getSourceId())) {
                query.setParameter("sourceId", Where.$like$(order.getSourceId()));
            }
            if (!StringUtils.isEmpty(order.getApplyType())) {
                query.setParameter("applyType", order.getApplyType());
            }
        }
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);
        System.out.println(" ----------------------------------------- " + hql);

        List<FinanceOrder> totalList = query.getResultList();


        page.setTotal(Long.valueOf(totalList.size()));
        List<FinanceOrder> financeOrderList = totalList.subList(page.getOffset(), (int) (page.getOffset() + page.getPage() * page.getTotal()));
        return Result.success().setData(financeOrderList).setMeta(page);
    }


    public List<AttachmentObject> getOnlineTraderAttachmentListByFinanceOrderId(Long financeId) {
        Task task = taskService.createTaskQuery().processInstanceBusinessKey(String.valueOf(financeId)).taskDefinitionKey(EnumFinanceEventType.onlineTraderAudit.toString()).singleResult();
        HistoricTaskInstance taskInstance = historyService.createHistoricTaskInstanceQuery().processInstanceBusinessKey(String.valueOf(financeId)).taskDefinitionKey(EnumFinanceEventType.onlineTraderAudit.toString()).singleResult();
        if (task == null && taskInstance == null) return null;
        String taskId = task != null ? task.getId() : taskInstance.getId();
        List<Attachment> attachmentList = taskService.getTaskAttachments(taskId);
        if (attachmentList == null || attachmentList.size() == 0) return null;
        return DozerUtils.copy(attachmentList, AttachmentObject.class);
    }

    public FinanceOrder findById(Long id) {
        FinanceOrder financeOrder = orderRepository.findOne(id);
        financeOrder.setAttachmentList(null);
        return financeOrder;
    }
}
