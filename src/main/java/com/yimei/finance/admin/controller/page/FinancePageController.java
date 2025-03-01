package com.yimei.finance.admin.controller.page;

import com.lowagie.text.DocumentException;
import com.yimei.finance.entity.admin.finance.FinanceOrderContract;
import com.yimei.finance.exception.NotFoundException;
import com.yimei.finance.admin.repository.finance.AdminFinanceOrderContractRepository;
import com.yimei.finance.admin.representation.finance.enums.EnumFinanceContractType;
import com.yimei.finance.common.service.contract.ContractServiceImpl;
import com.yimei.finance.common.representation.enums.EnumCommonError;
import com.yimei.finance.common.service.file.PDF;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

@RequestMapping("/finance/admin")
@Api(tags = {"admin-page"}, description = "管理后台-金融页面")
@Controller("adminFinancePageController")
public class FinancePageController {
    @Autowired
    private AdminFinanceOrderContractRepository orderContractRepository;
    @Autowired
    private ContractServiceImpl contractService;

    @RequestMapping(value = "/finance/{financeId}/contract/{type}/preview", method = RequestMethod.GET)
    @ApiOperation(value = "预览金融合同页面", notes = "预览金融合同页面")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "financeId", value = "金融申请单id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "type", value = "合同类型", required = true, dataType = "string", paramType = "path")
    })
    public String financeContractPreviewPage(@PathVariable("financeId") Long financeId,
                                             @PathVariable("type") int type, Map<String, Object> model) {
        if (StringUtils.isEmpty(EnumFinanceContractType.getTypeName(type))) throw new NotFoundException(EnumCommonError.传入参数错误.toString());
        if (orderContractRepository.findByFinanceIdAndType(financeId, type) == null) {
            model.put("contract", contractService.getFinanceOrderContractContent(financeId, type, false));
        } else {
            model.put("contract", contractService.getFinanceOrderContractContent(financeId, type, true));
        }
        return "admin/contract/contractPreview";
    }

    @RequestMapping(value = "/finance/{financeId}/contract/{type}/download", method = RequestMethod.GET)
    @ApiOperation(value = "下载金融合同", notes = "下载金融合同")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "financeId", value = "金融申请单id", required = true, dataType = "int", paramType = "path"),
            @ApiImplicitParam(name = "type", value = "合同类型", required = true, dataType = "string", paramType = "path")
    })
    public HttpEntity<byte[]> financeContractDownload(@PathVariable("financeId") Long financeId,
                                                      @PathVariable("type") int type) throws IOException, DocumentException {
        if (StringUtils.isEmpty(EnumFinanceContractType.getTypeName(type))) throw new NotFoundException(EnumCommonError.传入参数错误.toString());
        FinanceOrderContract financeOrderContract = orderContractRepository.findByFinanceIdAndType(financeId, type);
        String contract = "";
        String fileName = "";
        if (orderContractRepository.findByFinanceIdAndType(financeId, type) == null) {
            contract = contractService.getFinanceOrderContractContent(financeId, type, false);
            fileName = "标准合同.pdf";
        } else {
            contract = contractService.getFinanceOrderContractContent(financeId, type, true);
            fileName  = "合同-" + financeOrderContract.getContractNo() + ".pdf";
        }
        File file = PDF.createByHtml(contract);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", URLEncoder.encode(fileName,"UTF-8"));
        return new HttpEntity<>(FileUtils.readFileToByteArray(file), headers);

    }

}
