package com.yimei.finance.warehouse.representation.company.object;

import com.yimei.finance.common.representation.base.BaseObject;
import com.yimei.finance.warehouse.representation.company.enums.EnumWarehouseCompanyStatus;
import com.yimei.finance.warehouse.representation.company.object.validated.CreateWarehouseCompany;
import com.yimei.finance.warehouse.representation.company.object.validated.EditWarehouseCompany;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
@NoArgsConstructor
public class WarehouseCompanyObject extends BaseObject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(min = 1, max = 100, message = "公司名称应该在 {min}-{max} 个字符之间", groups = {CreateWarehouseCompany.class, EditWarehouseCompany.class})
    @NotBlank(message = "名称 不能为空", groups = {CreateWarehouseCompany.class, EditWarehouseCompany.class})
    private String name;                               //公司名称

    public String status;
    private int statusId;                              //状态id
    private String statusName;                         //状态名字
    @Size(max = 500, message = "备注不能超过 {max} 个字符", groups = {CreateWarehouseCompany.class, EditWarehouseCompany.class})
    private String remarks;                            //备注
    private String roleName;

    private String getStatusName() {
        if (StringUtils.isEmpty(status)) return null;
        return EnumWarehouseCompanyStatus.valueOf(status).name;
    }

}
