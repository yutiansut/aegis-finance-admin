package com.yimei.finance.representation.admin.company.object;

import com.yimei.finance.representation.admin.company.enums.EnumCompanyStatus;
import com.yimei.finance.representation.admin.company.validated.CreateCompany;
import com.yimei.finance.representation.admin.company.validated.EditCompany;
import com.yimei.finance.representation.common.base.BaseObject;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Range;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
@NoArgsConstructor
public class CompanyObject extends BaseObject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @NotBlank(message = "公司id不能为空", groups = {EditCompany.class})
    private Long id;

    @Size(min = 1, max = 100, message = "名称应该在 {min}-{max} 个字符之间", groups = {CreateCompany.class, EditCompany.class})
    @NotBlank(message = "名称 不能为空", groups = {CreateCompany.class, EditCompany.class})
    private String name;                               //公司名称

    public String status;
    private int statusId;                              //状态id
    private String statusName;                         //状态名字

    private String getStatusName() {
        if (StringUtils.isEmpty(status)) return null;
        return EnumCompanyStatus.valueOf(status).name;
    }

    @Range(min = 1, max = 100, message = "类型应在 {min}-{max} 天之间", groups = {CreateCompany.class})
    @NotBlank(message = "类型不能为空", groups = {CreateCompany.class})
    private int type;
    private String roleName;

}