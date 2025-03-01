/**
 * Created by JinWYP on 8/1/16.
 */

import slider from 'js/jquery-plugin/slide.js';
import {jQuery as $} from 'js/jquery-plugin/bootstrap.js';


var financeHome = () => {

    slider();

    var postApplyInfo = (query) => {
        var memberUrl = $("#memberUrl").val();
        var params = $.extend({}, query);
        $.ajax({
            url         : '/api/financing/apply',
            method      : 'POST',
            contentType : 'application/json;charset=utf-8',
            dataType    : 'json',
            data        : JSON.stringify(params),
            success     : (data)=> {
                if (data.success) {
                    $('.modal_1').modal('hide');
                    setTimeout(()=>{
                        $('.modal_2').modal();
                        $('#modalImg_2').removeClass('attention').addClass('yes');
                        $('#modalInfo_2').html('申请成功!');
                        $('#md_ok_2').val('确定');
                        $('#md_ok_2').click(()=>{ $('.modal_2').modal('hide') });
                    }, 500);
                } else {
                    if(data.error.code == 1501){
                        $('.modal_1').modal();
                        setTimeout(()=>{
                            $('#modalImg_1').removeClass('question').addClass('attention');
                            $('#modalInfo_1').html('企业信息认证未通过!');
                            $('.modalEm_1').html('企业信息认证通过后才能做融资申请哦～');
                            $('#md_ok_1').val('马上完善');
                            $('#md_ok_1').click(()=>{
                                location.href=memberUrl+"/account/companyLicence";
                            });
                        },500)

                    }else if(data.error.code == 1601){
                        $('.modal_1').modal('hide');
                        setTimeout(()=>{
                            $('.modal_2').modal();
                            $('#modalImg_2').removeClass('yes').addClass('attention');
                            $('#modalInfo_2').html('您当天的申请已超过限定次数!');
                            $('#md_ok_2').val('我知道了');
                            $('#md_ok_2').click(()=>{
                                $('.modal_2').modal('hide');
                            })
                        },500)

                    }else if(data.error.code == 401){
                        window.location.href = data.error.message;
                    }

                }
            }
        });
    };


    $('.banner_link').click(()=> {
        $('html, body').animate({scrollTop:'1200px'},'500',function(){});
    });
    //modal
    $('#slide .type-buy').click(()=>{
        $('.modal_1').modal();
        $('#modalImg_1').removeClass('attention').addClass('question');
        $('#modalInfo_1').html('确定提交申请"煤易购"?');
        $('#md_ok_1').off();
        $('#md_ok_1').click(()=> {
            postApplyInfo({
                applyType : 'MYG'
            });
        });
    });
    $('#slide .type-melt').click(()=>{
        $('.modal_1').modal();
        $('#modalImg_1').removeClass('attention').addClass('question');
        $('#modalInfo_1').html('确定提交申请"煤易融"?');
        $('#md_ok_1').off();
        $('#md_ok_1').click(()=>{
            postApplyInfo({
                applyType : 'MYR'
            });
        });
    });
    $('#slide .type-loan').click(()=>{
        $('.modal_1').modal();
        $('#modalImg_1').removeClass('attention').addClass('question');
        $('#modalInfo_1').html('确定提交申请"煤易贷"?');
        $('#md_ok_1').off();
        $('#md_ok_1').click(()=>{
            postApplyInfo({
                applyType : 'MYD'
            });
        });
    });


};


financeHome();

export default financeHome;

