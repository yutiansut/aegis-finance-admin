package com.yimei.finance.entity.admin.finance;

import com.yimei.finance.entity.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "t_finance_order_riskmanager_info")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinanceOrderRiskManagerInfo extends BaseEntity implements Serializable {
    @Id
    @Column(name = "id", unique = true, updatable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;                                                 //主键

    @Column(name = "finance_id", nullable = false, updatable = false, unique = true)
    private Long financeId;                                          //金融单id

    @Column(name = "distribution_ability_eval", length = 5020, columnDefinition = "TEXT")
    private String distributionAbilityEval;                          //分销能力评估

    @Column(name = "payment_situation_eval", length = 5020, columnDefinition = "TEXT")
    private String paymentSituationEval;                             //预计回款情况

    @Column(name = "business_risk_point", length = 5020, columnDefinition = "TEXT")
    private String businessRiskPoint;                                //业务风险点

    @Column(name = "risk_control_scheme", length = 5020, columnDefinition = "TEXT")
    private String riskControlScheme;                                //风险控制方案

    @Column(name = "final_conclusion", length = 5020, columnDefinition = "TEXT")
    private String finalConclusion;                                  //风控结论/最终结论/综合意见

    @Column(name = "need_supply_material", length = 1, nullable = false)
    private int needSupplyMaterial;                                  //需要补充材料 1: 需要, 0: 不需要

    @Column(name = "supply_material_introduce", length = 5020, columnDefinition = "TEXT")
    private String supplyMaterialIntroduce;                          //补充材料说明

    @Column(name = "edit_contract", length = 1, nullable = false)
    private int editContract;                                        //编辑合同     1: 需要编辑, 0: 不需要编辑

    @Column(name = "approve_state", length = 30)
    private String approveState;                                     //审批状态

    @Column(name = "approve_state_id", length = 3)
    private Integer approveStateId;                                  //审批状态Id

}

