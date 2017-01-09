package com.yimei.finance.admin.representation.finance.warehouse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseData implements Serializable {
    private WarehouseInitData initData;
    private WarehouseInvestigatorInfo investigatorInfo;
    private WarehouseSupervisorInfo supervisorInfo;
}