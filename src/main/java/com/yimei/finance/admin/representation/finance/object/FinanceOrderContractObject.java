package com.yimei.finance.admin.representation.finance.object;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yimei.finance.admin.representation.finance.enums.EnumFinanceContractType;
import com.yimei.finance.admin.representation.finance.enums.EnumFinanceOrderType;
import com.yimei.finance.admin.representation.finance.object.validated.SaveFinanceContract;
import com.yimei.finance.admin.representation.finance.object.validated.SubmitFinanceContract;
import com.yimei.finance.common.representation.base.BaseObject;
import com.yimei.finance.common.representation.enums.EnumCommonString;
import com.yimei.finance.common.representation.file.AttachmentObject;
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
import java.sql.Date;
import java.util.List;

@ApiModel(description = "金融单-合同内容")
@Data
@NoArgsConstructor
public class FinanceOrderContractObject extends BaseObject implements Serializable {
    private Long id;                                                 //主键  
    private Long financeId;                                          //金融单id  
    private String contractNo;                                       //合同编号  
    private String upstreamContractNo;                               //上游合同编号

    private String financeType;                                      //金融单类型
    private String financeTypeName;                                  //金融单类型名称
    private String financeSourceId;                                  //流水号，编号
    private Long applyUserId;                                        //申请人用户id
    private String applyUserName;                                    //申请人姓名
    private String applyUserPhone;                                   //申请人手机号
    private Long applyCompanyId;                                     //申请人公司id
    private String applyCompanyName;                                 //申请公司名称

    @Range(min = 1, max = 100, message = "合同类型 应在 {min}-{max} 之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    private Integer type;                                            //合同类型
    private String typeName;                                         //合同类型名称

    @Size(min = 1, max = 200, message = "签订地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "签订地点 不能为空", groups = {SubmitFinanceContract.class})
    private String signPlace;                                        //签订地点  

    @DateTimeFormat(pattern = EnumCommonString.LocalDate_Pattern)
    @JsonFormat(pattern = EnumCommonString.LocalDate_Pattern, timezone = EnumCommonString.GMT_8)
    private Date signDate;                                      //签订时间  

    private Integer signDate_Year;
    private Integer signDate_Month;
    private Integer signDate_Day;

    @Size(min = 0, max = 100, message = "船名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "船名 不能为空", groups = {SubmitFinanceContract.class})
    private String shipName;                                         //船名  

    @Size(min = 0, max = 100, message = "船次 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "船次 不能为空", groups = {SubmitFinanceContract.class})
    private String shipNo;                                           //船次  

    @Size(min = 0, max = 200, message = "购货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "购货地点 不能为空", groups = {SubmitFinanceContract.class})
    private String purchasePlace;                                    //购货地点  

    @Size(min = 0, max = 200, message = "卸货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "卸货地点 不能为空", groups = {SubmitFinanceContract.class})
    private String unloadedPlace;                                    //卸货地点  

    @Size(min = 0, max = 200, message = "卸货地点简称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "卸货地点简称 不能为空", groups = {SubmitFinanceContract.class})
    private String unloadedPlaceShort;                               //卸货地点简称  

    @Size(min = 0, max = 200, message = "交货地点 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "交货地点 不能为空", groups = {SubmitFinanceContract.class})
    private String deliveryPlace;                                    //交货地点  

    @Digits(integer = 9, fraction = 2, message = "煤炭吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "煤炭吨数 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal coalTon;                                      //煤炭吨数  

    @Digits(integer = 9, fraction = 2, message = "煤炭数量 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "煤炭数量 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal coalAmount;                                   //煤炭数量  

    @Size(min = 0, max = 100, message = "煤炭品种 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "煤炭品种 不能为空", groups = {SubmitFinanceContract.class})
    private String coalType;                                         //煤炭品种/品类  

    @Size(min = 0, max = 5000, message = "数量备注 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "数量备注 不能为空", groups = {SubmitFinanceContract.class})
    private String quantityRemark;                                   //数量备注,备注说明  

    @Size(min = 0, max = 5000, message = "质量备注 应在 {min}-{max} 个字符之间", groups = {SubmitFinanceContract.class})
    @NotBlank(message = "质量备注 不能为空", groups = {SubmitFinanceContract.class})
    private String qualityRemark;                                    //质量备注/其它质量标准

    @Range(min = 1, max = 7500, message = "热值 应在 {min}-{max} 个之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "热值 不能为空", groups = {SubmitFinanceContract.class})
    private Integer coalIndex_NCV;                                    //煤炭指标   - 热值

    @Digits(integer = 2, fraction = 2, message = "硫分 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "硫分 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal coalIndex_RS;                                 //煤炭指标   - 硫分

    @Digits(integer = 2, fraction = 2, message = "空干基挥发分 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    private BigDecimal coalIndex_ADV;

    @Size(min = 0, max = 5000, message = "数量验收标准 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "数量验收标准 不能为空", groups = {SubmitFinanceContract.class})
    private String quantityAcceptanceCriteria;                       //数量验收标准  

    @Digits(integer = 9, fraction = 2, message = "数量验收依据 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    private BigDecimal quantityAcceptanceBasis;                      //数量验收依据-吨数

    @Size(min = 0, max = 5000, message = "质量验收标准 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "质量验收标准 不能为空", groups = {SubmitFinanceContract.class})
    private String qualityAcceptanceCriteria;                        //质量验收标准  

    @Range(min = 0, max = 3650, message = "付款提货期限 应在 {min}-{max} 天之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "付款提货期限 不能为空", groups = {SubmitFinanceContract.class})
    private Integer paymentPeriod;                                       //付款提货期限

    @Digits(integer = 7, fraction = 2, message = "结算价格 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "结算价格 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal settlementPrice;                              //结算价格  

    @Digits(integer = 9, fraction = 2, message = "结算吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "结算吨数 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal settlementAmount;                             //结算吨数

    @Digits(integer = 16, fraction = 2, message = "保证金 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "保证金 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal cashDeposit;                                  //保证金

    @Size(min = 0, max = 100, message = "保证金大写 应在 {min}-{max} 个字符之间")
    private String cashDepositCapital;

    @Digits(integer = 7, fraction = 2, message = "卖家开票价格 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "卖家开票价格 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal sellerReceiptPrice;                           //卖家开票价格  

    @Digits(integer = 9, fraction = 2, message = "卖家开票吨数 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "卖家开票吨数 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal sellerReceiptAmount;                          //卖家开票吨数  

    @Digits(integer = 16, fraction = 2, message = "卖家开票金额 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "卖家开票金额 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal sellerReceiptMoney;                           //卖家开票金额  

    @Size(min = 0, max = 100, message = "卖家开票金额大写 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "开票金额大写不能为空", groups = {SubmitFinanceContract.class})
    public String sellerReceiptMoneyCapital;

    @Digits(integer = 16, fraction = 2, message = "买家已结清金额 最大支持 {integer}位整数, {fraction}位小数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
//    @NotBlank(message = "买家已结清金额 不能为空", groups = {SubmitFinanceContract.class})
    private BigDecimal buyerSettlementMoney;                         //买家已经结清金额  

    @Size(min = 0, max = 100, message = "买家已结清金额大写 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    public String buyerSettlementMoneyCapital;

    @Size(min = 0, max = 5000, message = "特别约定 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "特别约定 不能为空", groups = {SubmitFinanceContract.class})
    private String specialRemark;                                    //特别约定/特殊说明  

    @Range(min = 1, max = 100, message = "附件个数 必须是 {min}-{max} 之间的整数", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    private Integer attachmentNumber;                                    //附件个数  

    @Size(min = 0, max = 250, message = "附件名称 应在 {min}-{max} 个字符之间", groups = {SubmitFinanceContract.class})
    @NotBlank(message = "附件名称 不能为空", groups = {SubmitFinanceContract.class})
    private String attachmentNames;                                  //附件名称  

    @Size(min = 0, max = 100, message = "买家公司名称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家公司名称 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerCompanyName;                                 //买家公司名称  

    @Size(min = 0, max = 50, message = "买家联系人姓名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家联系人姓名 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerLinkmanName;                                 //买家联系人姓名  

    @Size(min = 0, max = 30, message = "买家联系人电话 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家联系人电话 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerLinkmanPhone;                                //买家联系人手机  

    @Size(min = 0, max = 100, message = "买家联系人邮箱 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家联系人邮箱 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerLinkmanEmail;                                //买家联系人邮箱  

    @Size(min = 0, max = 200, message = "买家公司地址 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家公司地址 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerCompanyAddress;                              //买家公司地址  

    @Size(min = 0, max = 50, message = "买家公司法人 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家公司法人 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerLegalPerson;                                 //买家法人  

    @Size(min = 0, max = 100, message = "买家开户行 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家开户行 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerBankName;                                    //买家开户银行  

    @Size(min = 0, max = 100, message = "买家银行账号 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "买家银行账号 不能为空", groups = {SubmitFinanceContract.class})
    private String buyerBankAccount;                                 //买家银行账号    

    @Size(min = 0, max = 100, message = "卖家公司名称 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家公司名称 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerCompanyName;                                //卖家公司名称  

    @Size(min = 0, max = 50, message = "卖家联系人姓名 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家联系人姓名 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerLinkmanName;                                //卖家联系人姓名  

    @Size(min = 0, max = 30, message = "卖家联系人电话 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家联系人电话 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerLinkmanPhone;                               //卖家联系人手机  

    @Size(min = 0, max = 100, message = "卖家联系人邮箱 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家联系人邮箱 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerLinkmanEmail;                               //卖家联系人邮箱  

    @Size(min = 0, max = 200, message = "卖家公司地址 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家公司地址 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerCompanyAddress;                             //卖家公司地址  

    @Size(min = 0, max = 50, message = "卖家公司法人 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家公司法人 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerLegalPerson;                                //卖家法人  

    @Size(min = 0, max = 100, message = "卖家开户行 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家开户行 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerBankName;                                   //卖家开户银行  

    @Size(min = 0, max = 100, message = "卖家银行账号 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    @NotBlank(message = "卖家银行账号 不能为空", groups = {SubmitFinanceContract.class})
    private String sellerBankAccount;                                //卖家银行账号    

    @Size(min = 0, max = 100, message = "供应商 应在 {min}-{max} 个字符之间", groups = {SaveFinanceContract.class, SubmitFinanceContract.class})
    private String coalSupplier;                                     //供应商

    List<AttachmentObject> attachmentList;                           //合同附件list

    public String getTypeName() {
        if (type == null) return null;
        else return EnumFinanceContractType.getTypeName(type);
    }

    public String getFinanceTypeName() {
        if (financeType == null) return null;
        return EnumFinanceOrderType.getName(EnumFinanceOrderType.valueOf(financeType));
    }

    public Integer getSignDate_Year() {
        if (signDate != null) return signDate.toLocalDate().getYear();
        return null;
    }

    public Integer getSignDate_Month() {
        if (signDate != null) return signDate.toLocalDate().getMonthValue();
        return null;
    }

    public Integer getSignDate_Day() {
        if (signDate != null) return signDate.toLocalDate().getDayOfMonth();
        return null;
    }
}
