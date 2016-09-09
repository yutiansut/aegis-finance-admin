package com.yimei.finance.representation.admin.finance.object;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "历史任务对象")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryTaskObject {
    protected String id;
    private String processInstanceId;                               //流程id
    private String taskDefinitionKey;                               //任务id(流程图中定义的id)
    private String assignee;                                        //处理人
    private String assigneeName;                                    //处理人姓名
    private String assigneeDepartment;                              //处理人部门
    private String name;                                            //任务名称
    private String description;                                     //任务描述
    private Date startTime;
    private Date endTime;
    protected Date dueDate;
    private Long financeId;                                         //金融单id
    private String applyCompanyName;                                //申请客户公司名称
    private String applyType;                                       //融资类型
    private String applyTypeName;                                   //融资类型Name
    private BigDecimal financingAmount;                             //融资金额
    private String sourceId;                                        //金融单业务编号
    private String currentAssignee;                                 //当前处理人id
    private String currentAssigneeName;                             //当前处理人姓名
    private String currentAssigneeDepartment;                       //当前处理人部门
    private String currentName;                                     //当前流程节点name
    private String currentTaskDefinitionKey;                        //当前流程节点id
}