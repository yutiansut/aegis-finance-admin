/**
 * Created by JinWYP on 8/1/16.
 */


import 'js/jquery-plugin/slide.js';
import 'js/jquery-plugin/jQuery.fn.datePicker';
import  {jQuery as $} from 'js/jquery-plugin/bootstrap.js';


var financeList = () => {
    //datePicker
    var pickerStart, pickerEnd,
        day_1 = 86400000,
        startObj = $(".startDate"),
        endObj = $(".endDate"),
        datePackerSettings = {
            //monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            //monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            //weekdaysFull: ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            //weekdaysShort: ['日','一', '二', '三', '四', '五', '六'],
            format: 'yyyy-mm-dd',
            clear: '清空'
        };
        pickerStart = startObj.pickadate(datePackerSettings).pickadate('picker');
        pickerEnd = endObj.pickadate(datePackerSettings).pickadate('picker');
        pickerStart.set("disable", [{from: [1970, 1, 1]}]);
        pickerEnd.set("disable", [{from: [1970, 1, 1]}]);

        startObj.on("change", function () {
            if (new Date(startObj.val()).getTime() > new Date(endObj.val()).getTime()) {
                endObj.val("");
            }
            pickerEnd.set("enable", true);
            pickerEnd.set("disable", [
                {from: [1970, 1, 1], to: new Date(new Date(startObj.val()).getTime() - day_1)}
            ]);
        });

};


financeList();

export default financeList;

