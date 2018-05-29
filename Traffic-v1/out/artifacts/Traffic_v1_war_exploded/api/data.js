(function () {
    var data_info =[];
    /**
     * 创建地图
     * */
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(106.65171, 26.628252), 16);
    map.setCurrentCity("贵阳市");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom();     //开启鼠标滚轮缩放
    map.disableDoubleClickZoom();//禁止双击放大
    var b = new BMap.Bounds(new BMap.Point(106.508772,26.3507077),new BMap.Point(106.878442,26.7711222));
    try {
        //BMapLib.AreaRestriction.setBounds(map, b);//设置地图范围
    } catch (e) {
        alert(e);
    }
    /**
     * 地图风格
     * */
    styleJson = [
        {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
                'color': '#031628'
            }
        }, {
            'featureType': 'land',
            'elementType': 'geometry',
            'stylers': {
                'color': '#000102'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#0b3d51'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#0b3d51'
            }
        }, {
            'featureType': 'local',
            'elementType': 'geometry',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#08304b'
            }
        }, {
            'featureType': 'subway',
            'elementType': 'geometry',
            'stylers': {
                'lightness': -70
            }
        }, {
            'featureType': 'building',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'all',
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#857f7f'
            }
        }, {
            'featureType': 'all',
            'elementType': 'labels.text.stroke',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'building',
            'elementType': 'geometry',
            'stylers': {
                'color': '#022338'
            }
        }, {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
                'color': '#062032'
            }
        }, {
            'featureType': 'boundary',
            'elementType': 'all',
            'stylers': {
                'color': '#465b6c'
            }
        }, {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
                'color': '#022338'
            }
        }, {
            'featureType': 'label',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }]
    map.setMapStyle({
        styleJson:styleJson
    });

    var ctrl = new BMapLib.TrafficControl();
    // map.addControl(ctrl);
    // ctrl.setAnchor(BMAP_ANCHOR_TOP_RIGHT);

    /**
     * 加载数据
     * */
    $.ajax({
        type: "post",//使用get方法访问后台
        dataType: "json",//返回json格式的数据
        //url: "./data/roadData.json",
        url: url+"/TrafficShowWeb/gps/loadGPS",
        //data: {name:"test"},//要发送的数据
        data: {},//要发送的数据
        success: function (data) {
            data_info = data.data;
            initData(data_info);
        },
        error: function (error) {
            console.log("error:" + error);
        }
    });
    /**
     * 在地图上标注信息
     * */
    var opts = {
        width : 0,     // 信息窗口宽度
        height: 0,     // 信息窗口高度
        title : "<div style=''>"+'路段信息'+"</div>" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    function initData(data) {
        map.removeOverlay();
        var myIcon = new BMap.Icon("images/roadmark.png", new BMap.Size(30,30));
        for (var i = 0; i < data.length; i ++) {
            var marker = new BMap.Marker(new BMap.Point(data[i]["lng"],data[i]["lat"]),{icon:myIcon});
            var content = data[i]["roadname"];
            map.addOverlay(marker);
            var code = data[i]["roadId"];
            addClickHandler(content,marker,code)
        }
    }
    function addClickHandler(content,marker,code){
        var time = "2018-01-01 08:05:06";
        marker.addEventListener("click",function(e){
            /**
             * 点击标注点
             * */
            $.ajax({
                type: "post",//使用get方法访问后台
                dataType: "json",//返回json格式的数据
                // url: "http://192.168.100.245:8080/TrafficShowWeb/flow/findRegexRow",
                url:url+ "/TrafficShowWeb/flow/findone",
                data: {address:code,time:time},//要发送的数据
                success: function (data) {

                    var datas = data.data.list;
                    var eastward,westward,southward,northward;
                    var arr = new Array();

                    if (datas.length != 0){

                        arr.push("<div class='directio-show'>");
                        arr.push("<h4>"+'路口：'+ content +"</h4>");
                        arr.push("<p>"+'时间：'+ time +"</p>");
                        arr.push("<p>"+'交通总量：'+ 180 +"</p>");
                        for (var i = 0; i < datas.length; i ++) {
                            arr.push("<p class=''>"+ "<span>"+ '西向来车:'+ "<span>"+
                                '左转'+ datas[i]["left"] +
                                '，直行'+ datas[i]["straight"] +
                                '，右转'+ datas[i]["right"] +
                                "<p>");
                        }
                        arr.push("</div>");
                        var contents = arr.join("");
                        openInfo(contents,e);
                    }else {
                        var contents = "<div>" +
                            "<h4>"+ content +"</h4>"+
                            "<p>"+ "<span>" +"暂无数据"+"<span>" +"<p>"
                            + "</div>"
                        openInfo(contents,e);
                    }
                },
                error: function (error) {
                    console.log("error:" + error);
                }
            })
        });
    }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }

    map.addEventListener("click", showInfo);
    /**
     * 添加点击背景事件
     * */
    var currentLng,currentLat;
    function showInfo(e) {
        $("input").blur();
        $(".search-record").addClass("hide");

        currentLng = e.point.lng;
        currentLat = e.point.lat;
        var item = $("#item")
        //显示隐藏经纬度验证
        if (item.hasClass("hide")){
            // item.removeClass("hide");
            document.getElementById("lng").value = currentLng;
            document.getElementById("lat").value = currentLat;
        }else {
            // item.addClass("hide");
        }
    }
    /**
     * 修正GPS
     * */
    $("#sureBtn").click(function () {
        var distance = $("#distance").val();
        if (distance > 500) {
            alert("距离必须小于500");
        }
        console.log("点击了测试",currentLng,currentLat,distance);
        $.ajax({
            type: "post",//使用get方法访问后台
            dataType: "json",//返回json格式的数据
            url: "http://192.168.100.245:8080/TrafficShowWeb/gps/change",
            data: {lng:currentLng,lat:currentLat,distance:distance},//要发送的数据
            success: function (data) {
                if (data.code == 200) {
                    console.log("successful");
                    initData(data.data);
                }else {
                    alert(data.msg)
                }
            },
            error: function (error) {
                console.log("error:" + error);
            }
        })
    });
    /**
     * 监听缩放层级
     * */
    map.addEventListener("zoomend", function(){
        // console.log("地图缩放至：" + this.getZoom() + "级");
    });
    /**
     * 监听输入框焦点事件
     * */
    $("#keyword").focus(function(){
        $(".search-record").removeClass("hide");
    });

    /**
     * 点击了搜索
     * */
    $(".search").click(function () {
        var keyword = $(".keyword").val();
        if (keyword) {
            var local = new BMap.LocalSearch(map, {
                renderOptions:{map: map}
            });
            local.search(keyword);
            map.centerAndZoom(keyword,16);
        }
    });
    /**
     * 历史记录数据
     * */
    $.ajax({
        type: "post",//使用get方法访问后台
        dataType: "json",//返回json格式的数据
        url: "./data/searchRecord.json",
        data: {},//要发送的数据
        success: function (data) {
            var divStr;
            for (var i  =0; i < data.length; i ++) {
                divStr = '<li onmouseover="mouseoverEvent(this)" onmouseleave="mouseleaveEvent(this)">'
                    +'<span class="inblock record-name" data-num="2" onclick="clickRecord(this)">'+data[i].name+'</span>'
                    +'<span class="fr hide ter record-delete inblock" onclick="deleteRecord(this)">'+'删除'+'</span>'
                    +'</li>'
            }
            $(".search-list").append(divStr);
        },
        error: function (error) {
            console.log("error:" + error);
        }
    })
})();

/**
 * 历史记录面板
 * */
function mouseoverEvent(that) {
    $(that).css("background-color","#cc9966");
    $(that).children(".record-delete").removeClass("hide");
}
function mouseleaveEvent(that) {
    $(that).css("background-color","#fff");
    $(that).children(".record-delete").addClass("hide");
}
//获取焦点时候调用
$("#keyword").focus(function () {
    if ($(".keyword").val() ==''&&$(".keyword").val().trim().length == 0) {
        $(".search-record").removeClass("hide");
    }else {
        $(".search-record").addClass("hide");
    }
})
/**
 * 判断输入框是否为空
 * */
$(".keyword").bind("input propertychange change",function(event){
    if ($(".keyword").val() ==''&&$(".keyword").val().trim().length == 0) {
        console.log("kong");
        $(".search-record").removeClass("hide");
    }else {
        console.log("buwei");
        $(".search-record").addClass("hide");
    }
});
//点击了记录
function clickRecord(that) {
    console.log("点击了记录",that);
    $("#keyword").val($(that).html());
    $(".search-record").addClass("hide");
}
//点击了删除
function deleteRecord(that) {
    console.log("点击了删除");
}
/**
 * ================================右边设置操作
 * */
//切换交通条件操作
$(".item-select").find(".select:first").show();    //为每个BOX的第一个元素显示
$(".traffic-item li").on("click",function(){ //给li标签添加事件
    var index = $(this).index();  //获取当前li标签的个数
    console.log(index)
    $(this).parent().next().find(".select").hide().eq(index).show(); //返回上一层，在下面查找css名为box隐藏，然后选中的显示
    $(this).addClass("active").siblings().removeClass("active"); //a标签显示，同辈元素隐藏
})

function testMap() {
    console.log("点击了测试");
    window.location.href = "test.html";
}



















