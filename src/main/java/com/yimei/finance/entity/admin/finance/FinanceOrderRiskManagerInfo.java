package com.yimei.finance.entity.admin.finance;

import com.yimei.finance.entity.common.basic.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Table(name = "t_finance_order_riskmanager_info")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinanceOrderRiskManagerInfo extends BaseEntity implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;                                                 //主键
    @Column(name = "finance_id", nullable = false)
    private Long financeId;                                          //金融单id
    @Column(name = "distribution_ability_eval", length = 1000)
    private String distributionAbilityEval;                          //分销能力评估
    @Column(name = "payment_situation_eval", length = 1000)
    private String paymentSituationEval;                             //预计回款情况
    @Column(name = "business_risk_point", length = 1000)
    private String businessRiskPoint;                                //业务风险点
    @Column(name = "risk_control_scheme", length = 1000)
    private String riskControlScheme;                                //风险控制方案
    @Column(name = "final_conclusion", length = 1000)
    private String finalConclusion;                                  //风控结论/最终结论/综合意见
    @Column(name = "need_supply_material", nullable = false)
    private boolean needSupplyMaterial;                              //需要补充材料 true: 需要, false: 不需要
    @Column(name = "supply_material_introduce", length = 500)
    private String supplyMaterialIntroduce;                          //补充材料说明
    @Column(name = "notice_apply_user")
    private boolean noticeApplyUser;                                 //通知申请用户 true: 通知, false: 不通知
    @Column(name = "notice_salesman")
    private boolean noticeSalesman;                                  //通知业务员   true: 通知, false: 不通知
    @Column(name = "edit_contract")
    private boolean editContract;                                    //编辑和他     true: 需要编辑, false: 不需要编辑
    @Column(name = "audit_status_id", length = 3)
    private int auditStatusId;                                       //审核状态id
    @Column(name = "audit_status", length = 50)
    private String auditStatus;                                      //审核状态
    @Transient
    List<AttachmentObject> attachmentList;                           //附件列表

}