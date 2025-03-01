package com.yimei.finance.admin.controller.restfulapi.company;

import com.yimei.finance.config.session.AdminSession;
import com.yimei.finance.admin.representation.company.object.CompanyObject;
import com.yimei.finance.admin.representation.company.object.RiskCompanySearch;
import com.yimei.finance.admin.representation.company.object.validated.CreateCompany;
import com.yimei.finance.admin.representation.company.object.validated.EditCompany;
import com.yimei.finance.common.representation.result.Page;
import com.yimei.finance.common.representation.result.Result;
import com.yimei.finance.admin.service.company.AdminCompanyServiceImpl;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Api(tags = "admin-api-company")
@RequestMapping("/api/financing/admin/company")
@RestController("adminCompanyController")
public class CompanyController {
    @Autowired
    private AdminCompanyServiceImpl companyService;
    @Autowired
    private AdminSession adminSession;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "根据id获取公司对象", response = CompanyObject.class)
    @ApiImplicitParam(name = "id", value = "公司 id", dataType = "int", paramType = "path")
    public Result findByIdMethod(@PathVariable("id")Long id) {
        return companyService.findByIdWithAuthority(id, adminSession.getUser().getId());
    }

    @RequestMapping(value = "/self", method = RequestMethod.GET)
    @ApiOperation(value = "查询自己所在的风控线(公司)", response = CompanyObject.class)
    public Result findSelfCompanyMethod() {
        return companyService.findById(adminSession.getUser().getCompanyId());
    }

    @RequestMapping(value = "/risk/all", method = RequestMethod.GET)
    @ApiOperation(value = "风控线列表,不分页", response = CompanyObject.class, responseContainer = "List")
    public Result findAllRiskOrganizationListMethod() {
        return companyService.adminFindRiskCompanyList(adminSession.getUser().getCompanyId());
    }

    @RequestMapping(value = "/risk", method = RequestMethod.GET)
    @ApiOperation(value = "风控线列表", response = CompanyObject.class, responseContainer = "List")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "name", value = "风控线名称", required = false, dataType = "string", paramType = "query"),
            @ApiImplicitParam(name = "adminName", value = "风控线管理员名称", required = false, dataType = "string", paramType = "query")
    })
    public Result findRiskOrganizationListMethod(RiskCompanySearch riskCompanySearch,
                                                 @ApiParam(name = "page", value = "分页参数", required = false) Page page) {
        return companyService.adminFindRiskCompanyList(riskCompanySearch, adminSession.getUser().getCompanyId(), page);
    }

    @RequestMapping(method = RequestMethod.POST)
    @ApiOperation(value = "创建公司", notes = "根据 company 对象创建用户", response = CompanyObject.class)
    public Result addCompanyMethod(@ApiParam(name = "company", value = "公司对象", required = true) @Validated(value = {CreateCompany.class}) @RequestBody CompanyObject company) {
        return companyService.addCompany(company, adminSession.getUser());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @ApiOperation(value = "修改公司", notes = "根据 company 对象修改用户", response = CompanyObject.class)
    @ApiImplicitParam(name = "id", value = "公司 id", dataType = "int", paramType = "path")
    public Result editCompanyMethod(@PathVariable("id") Long id,
                                    @ApiParam(name = "company", value = "公司对象", required = true) @Validated(value = {EditCompany.class}) @RequestBody CompanyObject company) {
        return companyService.editCompany(id, company, adminSession.getUser().getId());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value = "删除公司", notes = "根据 id 删除公司", response = CompanyObject.class)
    @ApiImplicitParam(name = "id", value = "公司 id", dataType = "int", paramType = "path")
    public Result deleteCompanyMethod(@PathVariable("id") Long id) {
        return companyService.deleteCompany(id, adminSession.getUser().getId());
    }

}
