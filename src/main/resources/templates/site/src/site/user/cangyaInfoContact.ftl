<!DOCTYPE html >
<html lang="zh-cmn-Hans">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /> <!-- 优先使用 IE 最新版本和 Chrome -->
    <meta name="renderer" content="webkit"> <!--360浏览器就会在读取到这个标签后，立即切换对应的内核。并将这个行为应用于这个二级域名下所有网址。-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-siteapp" />

    <title>${title}</title>

    <link rel="stylesheet" href="${staticPath}/jspm_packages/github/twbs/bootstrap@3.3.7/css/bootstrap.min.css">
    <!--<link rel="stylesheet" href="${staticPath}/jspm_packages/npm/webuploader@0.1.8/css/webuploader.css">-->
    <link rel="stylesheet" href="${staticPath}/css/stylesheets/main.css">



    <!-- HTMLshiv for IE -->
    <!--[if lte IE 9]>
    <script src="${staticPath}/jspm_packages/html5shiv/dist/html5shiv.min.js"></script>
    <![endif]-->

    <link type="image/x-icon" rel="shortcut icon" href="${staticPath}/css/images/favicon.ico" />

    <meta name="keywords" content="易煤网">
    <meta name="description" content="易煤网">

    <link rel="stylesheet" href="${staticPath}/css/stylesheets/layout/leftmenu.css">
    <link rel="stylesheet" href="${staticPath}/css/stylesheets/page/cangyaInfoContact.css">
</head>
<body>
<!-- header start -->
<#include "../common/header.ftl" >
<!-- header stop -->

<!--供应链金融导航开始-->
<#include "../common/pagenav.ftl" >
<!--供应链金融导航结束-->

<!--融资管理开始-->
<div class="financeManageWrap">
    <div class="financeManage clearfix">
        <!--侧边栏开始-->
            <#include "../common/leftmenu.ftl" >
        <!--侧边栏结束-->

        <!--右侧主内容开始-->
        <div class="financeCon ms-controller" ms-controller="financeInfo">
            <div class="application">
                <h4><span></span>融资详情 - 填写合同 - 煤易贷 </h4>
                <div class="contact" >
                    <div class="contact-title">
                        <em></em>编辑下载合同
                    </div>
                    <div class="contactList">
                        <h3>上游采购合同:</h3>
                        <ul>
                            <li>
                                <span><em></em>《仓押上游采购合同》</span>
                                <b></b>
                                <a href=""><em></em>下载</a>
                                |
                                <a href="">预览</a>
                                |
                                <a href="javascript:">编辑</a>
                            </li>
                        </ul>
                        <h3>下游采购合同:</h3>
                        <ul>
                            <li>
                                <span><em></em>《仓押下游采购合同》</span>
                                <b></b>
                                <a href=""><em></em>下载</a>
                                |
                                <a href="">预览</a>
                                |
                                <a href="javascript:">编辑</a>
                            </li>
                        </ul>
                        <h3>附件:</h3>
                        <ul>
                            <li>
                                <span><em></em>《附件1》</span>
                                <b class="w70"></b>
                                <a href=""><em></em>下载</a>
                                |
                                <a href="">预览</a>
                                |
                                <a href="javascript:">编辑</a>
                            </li>
                            <li>
                                <span><em></em>《附件2》</span>
                                <b class="w70"></b>
                                <a href=""><em></em>下载</a>
                                |
                                <a href="">预览</a>
                                |
                                <a href="javascript:">编辑</a>
                            </li>
                        </ul>
                    </div>


                    <div class="contact-title">
                        <em></em>上传合同:
                    </div>
                    <div class="contactUp">
                       <div class="upLoad">
                           <label>上游合同上传:</label>
                           <div class="push" id="picker"><em></em>点击上传</div>
                           <p class="tips">提示：最多可上传<span>20个文件</span>，单个文件 <span>不大于1G</span>。</p>
                           <div class="filesList">
                               <div class="uploader-list fileName" ms-for="(index, file) in @upFilesList">
                                   <em class="ico"></em>
                                   <span class="info">{{file.name}}</span>
                                   <em class="close">✖</em>
                               </div>
                           </div>
                       </div>
                    </div>
                    <div class="contactUp">
                        <div class="upLoad">
                            <label>下游合同上传:</label>
                            <div class="push" id="picker2"><em></em>点击上传</div>
                            <p class="tips">提示：最多可上传<span>20个文件</span>，单个文件 <span>不大于1G</span>。</p>
                            <div class="filesList">
                                <div class="uploader-list fileName" ms-for="(index, file) in @downFilesList">
                                    <em class="ico"></em>
                                    <span class="info">{{file.name}}</span>
                                    <em class="close">✖</em>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contactUp">
                        <div class="upLoad">
                            <label>附件上传:</label>
                            <div class="push" id="picker3"><em></em>点击上传</div>
                            <p class="tips">提示：最多可上传<span>20个文件</span>，单个文件 <span>不大于1G</span>。</p>
                            <div class="filesList">
                                <div class="uploader-list fileName" ms-for="(index, file) in @annexFilesList">
                                    <em class="ico"></em>
                                    <span class="info">{{file.name}}</span>
                                    <em class="close">✖</em>
                                </div>
                            </div>
                        </div>
                    </div>



                    <a href="" class="btn save">保存</a>
                    <a href="/finance/user/cangya/11" class="btn back">返回</a>
                    <p class="attention"><span>* </span>合同保存后，将<span>自动发送给资金方</span>，供其查阅。</p>
                </div>
            </div>
        </div>
        <!--右侧主内容结束-->
    </div>
</div>
<!--融资管理结束-->

<!--footer start-->
<#include "../common/footer.ftl" >
<!--footer stop-->

<!--modal start-->
<#include "../common/modal.ftl" >
<!--modal stop-->

<script src="${staticPath}/jspm_packages/system.js"></script>
<script src="${staticPath}/js/config.js"></script>



<#if env == 'dev' || env == 'staging' || env == 'prod' >
<!-- Remove this statement if you want to run the on the fly transpiler -->
<!-- 生产环境使用 bundle.js 文件 -->
<script src="${staticPath}/js/page/dependencies.bundle.js"></script>
<script src="${staticPath}/js/page/userCenterFinanceInfo.bundle.js"></script>
</#if>

<!--<script src="${staticPath}/js/page-temp-bundle/dependencies.bundle.js"></script>-->
<!--<script src="${staticPath}/js/page-temp-bundle/userCenterFinanceInfo.bundle.js"></script>-->
<script>
    System['import']('${staticPath}/js/page/cangyaInfoContact.js')
</script>


</body>
</html>