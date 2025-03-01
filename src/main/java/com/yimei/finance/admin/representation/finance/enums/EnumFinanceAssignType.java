package com.yimei.finance.admin.representation.finance.enums;

import com.yimei.finance.admin.representation.group.EnumSpecialGroup;

public enum EnumFinanceAssignType {
    assignOnlineTrader(EnumSpecialGroup.OnlineTraderGroup.id, EnumFinanceEventType.onlineTraderAudit.toString(), "分配线上交易员"),
    assignSalesman(EnumSpecialGroup.SalesmanGroup.id, EnumFinanceEventType.salesmanAudit.toString(), "分配业务员"),
    assignInvestigator(EnumSpecialGroup.InvestigatorGroup.id, EnumFinanceEventType.investigatorAudit.toString(), "分配尽调员"),
    assignSupervisor(EnumSpecialGroup.SupervisorGroup.id, EnumFinanceEventType.supervisorAudit.toString(), "分配监管员"),
    assignRiskManager(EnumSpecialGroup.RiskGroup.id, EnumFinanceEventType.riskManagerAudit.toString(), "分配风控人员"),
    ;

    public String id;
    public String nextStep;
    public String name;

    EnumFinanceAssignType(){};

    EnumFinanceAssignType(String id, String nextStep, String name) {
        this.id = id;
        this.nextStep = nextStep;
        this.name = name;
    }
}
