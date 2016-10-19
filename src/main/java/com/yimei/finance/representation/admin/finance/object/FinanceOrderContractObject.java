package com.yimei.finance.representation.admin.finance.object;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yimei.finance.representation.admin.finance.enums.EnumFinanceContractType;
import com.yimei.finance.representation.admin.finance.object.validated.SaveFinanceContract;
import com.yimei.finance.representation.common.base.BaseObject;
import com.yimei.finance.representation.common.enums.EnumCommonString;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Range;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "金融单-合同内容")
@Data
@NoArgsConstructor
public class FinanceOrderContractObject extends BaseObject implements Serializable {
    private Long id;                                                 //主键  
    private Long financeId;                                          //金融单id  
    private String contractNo;                                       //合同编号  

    @Range(min = 1, max = 100, message = "合同类型 应在 {min}-{max} 之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "合同类型 不能为空", groups = {SaveFinanceContract.class})
    private Integer type;                                            //合同类型
    private String typeName;                                         //合同类型名称

    @Size(min = 1, max = 200, message = "签订地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "签订地点 不能为空", groups = {SaveFinanceContract.class})
    private String signPlace;                                        //签订地点  

    @DateTimeFormat(pattern = EnumCommonString.LocalDate_Pattern)
    @JsonFormat(pattern = EnumCommonString.LocalDate_Pattern, timezone = EnumCommonString.GMT_8)
    private Date signDate;                                           //签订时间  

    @Size(min = 1, max = 100, message = "船名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "船名 不能为空", groups = {SaveFinanceContract.class})
    private String shipName;                                         //船名  

    @Size(min = 1, max = 100, message = "船次 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "船次 不能为空", groups = {SaveFinanceContract.class})
    private String shipNo;                                           //船次  

    @Size(min = 1, max = 200, message = "购货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "购货地点 不能为空", groups = {SaveFinanceContract.class})
    private String purchasePlace;                                    //购货地点  

    @Size(min = 1, max = 200, message = "卸货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卸货地点 不能为空", groups = {SaveFinanceContract.class})
    private String unloadedPlace;                                    //卸货地点  

    @Size(min = 1, max = 200, message = "卸货地点简称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卸货地点简称 不能为空", groups = {SaveFinanceContract.class})
    private String unloadedPlaceShort;                               //卸货地点简称  

    @Size(min = 1, max = 200, message = "交货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "交货地点 不能为空", groups = {SaveFinanceContract.class})
    private String deliveryPlace;                                    //交货地点  

    @Digits(integer = 9, fraction = 2, message = "煤炭吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "煤炭吨数 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal coalTon;                                      //煤炭吨数  

    @Digits(integer = 9, fraction = 2, message = "煤炭数量 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "煤炭数量 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal coalAmount;                                   //煤炭数量  

    @Size(min = 1, max = 100, message = "煤炭品种 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "煤炭品种 不能为空", groups = {SaveFinanceContract.class})
    private String coalType;                                         //煤炭品种/品类  

    @Size(min = 1, max = 5000, message = "数量备注 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "数量备注 不能为空", groups = {SaveFinanceContract.class})
    private String quantityRemark;                                   //数量备注,备注说明  

    @Size(min = 1, max = 5000, message = "煤炭指标 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "煤炭指标 不能为空", groups = {SaveFinanceContract.class})
    private String coalIndex;                                        //煤炭指标  

    @Size(min = 1, max = 5000, message = "质量备注 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "质量备注 不能为空", groups = {SaveFinanceContract.class})
    private String qualityRemark;                                    //质量备注/质量说明  

    @Size(min = 1, max = 5000, message = "数量验收标准 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "数量验收标准 不能为空", groups = {SaveFinanceContract.class})
    private String quantityAcceptanceCriteria;                       //数量验收标准  

    @Size(min = 1, max = 5000, message = "质量验收标准 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "质量验收标准 不能为空", groups = {SaveFinanceContract.class})
    private String qualityAcceptanceCriteria;                        //质量验收标准  

    @Range(min = 1, max = 3650, message = "付款提货期限 应在 {min}-{max} 天之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "付款提货期限 不能为空", groups = {SaveFinanceContract.class})
    private int paymentPeriod;                                       //付款提货期限

    @Digits(integer = 7, fraction = 2, message = "结算价格 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "结算价格 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal settlementPrice;                              //结算价格  

    @Digits(integer = 9, fraction = 2, message = "结算吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "结算吨数 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal settlementAmount;                             //结算吨数

    @Digits(integer = 16, fraction = 2, message = "保证金 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "保证金 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal cashDeposit;                                  //保证金

    @Digits(integer = 7, fraction = 2, message = "卖家开票价格 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家开票价格 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal sellerReceiptPrice;                           //卖家开票价格  

    @Digits(integer = 9, fraction = 2, message = "卖家开票吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家开票吨数 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal sellerReceiptAmount;                          //卖家开票吨数  

    @Digits(integer = 16, fraction = 2, message = "卖家开票金额 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家开票金额 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal sellerReceiptMoney;                           //卖家开票金额  

    @Digits(integer = 16, fraction = 2, message = "买家已结清金额 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家已结清金额 不能为空", groups = {SaveFinanceContract.class})
    private BigDecimal buyerSettlementMoney;                         //买家已经结清金额  

    @Size(min = 1, max = 5000, message = "特别约定 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "特别约定 不能为空", groups = {SaveFinanceContract.class})
    private String specialRemark;                                    //特别约定/特殊说明  

    @Range(min = 1, max = 100, message = "附件个数 应在 {min}-{max} 个之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "附件个数 不能为空", groups = {SaveFinanceContract.class})
    private int attachmentNumber;                                    //附件个数  

    @Size(min = 1, max = 250, message = "附件名称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "附件名称 不能为空", groups = {SaveFinanceContract.class})
    private String attachmentNames;                                  //附件名称  

    @Size(min = 1, max = 100, message = "买家公司名称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家公司名称 不能为空", groups = {SaveFinanceContract.class})
    private String buyerCompanyName;                                 //买家公司名称  

    @Size(min = 1, max = 50, message = "买家联系人姓名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家联系人姓名 不能为空", groups = {SaveFinanceContract.class})
    private String buyerLinkmanName;                                 //买家联系人姓名  

    @Size(min = 1, max = 30, message = "买家联系人电话 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家联系人电话 不能为空", groups = {SaveFinanceContract.class})
    private String buyerLinkmanPhone;                                //买家联系人手机  

    @Size(min = 1, max = 100, message = "买家联系人邮箱 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家联系人邮箱 不能为空", groups = {SaveFinanceContract.class})
    private String buyerLinkmanEmail;                                //买家联系人邮箱  

    @Size(min = 1, max = 200, message = "买家公司地址 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家公司地址 不能为空", groups = {SaveFinanceContract.class})
    private String buyerCompanyAddress;                              //买家公司地址  

    @Size(min = 1, max = 50, message = "买家公司法人 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家公司法人 不能为空", groups = {SaveFinanceContract.class})
    private String buyerLegalPerson;                                 //买家法人  

    @Size(min = 1, max = 100, message = "买家开户行 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家开户行 不能为空", groups = {SaveFinanceContract.class})
    private String buyerBankName;                                    //买家开户银行  

    @Size(min = 1, max = 100, message = "买家银行账号 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "买家银行账号 不能为空", groups = {SaveFinanceContract.class})
    private String buyerBankAccount;                                 //买家银行账号    

    @Size(min = 1, max = 100, message = "卖家公司名称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家公司名称 不能为空", groups = {SaveFinanceContract.class})
    private String sellerCompanyName;                                //卖家公司名称  

    @Size(min = 1, max = 50, message = "卖家联系人姓名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家联系人姓名 不能为空", groups = {SaveFinanceContract.class})
    private String sellerLinkmanName;                                //卖家联系人姓名  

    @Size(min = 1, max = 30, message = "卖家联系人电话 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家联系人电话 不能为空", groups = {SaveFinanceContract.class})
    private String sellerLinkmanPhone;                               //卖家联系人手机  

    @Size(min = 1, max = 100, message = "卖家联系人邮箱 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家联系人邮箱 不能为空", groups = {SaveFinanceContract.class})
    private String sellerLinkmanEmail;                               //卖家联系人邮箱  

    @Size(min = 1, max = 200, message = "卖家公司地址 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家公司地址 不能为空", groups = {SaveFinanceContract.class})
    private String sellerCompanyAddress;                             //卖家公司地址  

    @Size(min = 1, max = 50, message = "卖家公司法人 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家公司法人 不能为空", groups = {SaveFinanceContract.class})
    private String sellerLegalPerson;                                //卖家法人  

    @Size(min = 1, max = 100, message = "卖家开户行 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家开户行 不能为空", groups = {SaveFinanceContract.class})
    private String sellerBankName;                                   //卖家开户银行  

    @Size(min = 1, max = 100, message = "卖家银行账号 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class})
    @NotBlank(message = "卖家银行账号 不能为空", groups = {SaveFinanceContract.class})
    private String sellerBankAccount;                                //卖家银行账号    

    public String getTypeName() {
        if (type == null) return null;
        else return EnumFinanceContractType.getTypeName(type);
    }

}