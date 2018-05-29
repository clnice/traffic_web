//请求路径
var url;
var devModel = true;
if(devModel) {
    url = "http://222.85.139.245:20245";
}else{
    url = "lineModel";
}

/**
 * 给路的描点操作
 * */
var lineflag = 0;
$("#show-roadline").click(function () {
    if (lineflag == 0) {
        $("#roadline").css({"display":'block'});
        lineflag = 1;
    }else {
        $("#roadline").css({"display":'none'});
        lineflag = 0;
    }

})
/**
 * 新增路口的点
 * */
var pointflag = 0;
$("#show-roadpoint").click(function () {
    if (pointflag == 0) {
        $("#roadpoint").css({"display":'block'});
        pointflag = 1;
    }else {
        $("#roadpoint").css({"display":'none'});
        pointflag = 0;
    }
});
var timeFlag = 0;
$(".time-icon").click (function () {
    if (timeFlag == 0) {
        $(".time-select").css({"display":'block'});
        timeFlag = 1;
    }else {
        $(".time-select").css({"display":'none'});
        timeFlag = 0;
    }
})
