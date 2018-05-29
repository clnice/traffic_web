<!--地图-->
<!--echart描点-->
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
//一些参数
var ratio = 60 / 600;//比例
var app = {};
var bmap = {};
var manual = false;//手册
var identifier = 0;//标识符
var limitOfCars = 20;//限制
var option = null;
app.title = '贵阳交通系统 - 线特效';

var schema = [{
    index: 1,
    text: '平均车速',
    unit: 'km/h'
}];
//所有路段的点信息和其他车辆信息
var totalLines = [];
//拥堵指数
var totolTips = [];
//路口信息
var totalCrossDatas = [];
//存放时间的对象
var objDate = {};

getGPSDate();
function getGPSDate() {
    /**
     * 加载所有路段 经纬度信息
     * */
    $.ajax({
        type: "post",//使用get方法访问后台
        dataType: "json",
        url:url+"/TrafficShowWeb/gps/loadLineGPS",
        // data:{time: objDate.time},
        success: function (dataLines) {
            console.log("dataLines:",dataLines);
            initLineFunction(dataLines.data);
        },
        error: function (error) {
            console.log("error:" + error);
        }
    });
}
//初始化道路gps 和 所有平均速度及平均旅行时间
function initLineFunction(dataline) {

    // var hStep = 300 / (data.length - 1);
    //处理道路gps 返回经纬度的点集
    var busLines = [].concat.apply([], dataline.map(function (busLine, idx) {
        // console.log("request路线:",busLine["line_gps"]);

        var line_gps_arr = busLine["line_gps"].substring(1,busLine["line_gps"].length-1).split(",");
        for (var j = 0; j < line_gps_arr.length; j ++) {
            line_gps_arr[j] = parseFloat(line_gps_arr[j]);
        }
        var prevPt;
        var points = [];
        //封装经纬度 和 首尾点lines
        for (var i = 0; i < line_gps_arr.length; i += 2) {
            var pt = [line_gps_arr[i], line_gps_arr[i + 1]];
            points.push([pt[1], pt[0]]);
        }
        //返回点集
        return {
            coords: points,
            lines:busLine["line"]
        };
    }));
    // console.log("request点集：",busLines);
    option = {
        baseOption:{
            bmap: {
                center: [106.646914, 26.635041],
                zoom: 14,
                roam: true,
                // roam: 'move'
                mapStyle: {
                    'styleJson': [
                        {
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#031628'
                            }
                        },
                        {
                            'featureType': 'land',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000102'
                            }
                        },
                        {
                            'featureType': 'highway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        },
                        {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'arterial',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#0b3d51'
                            }
                        },
                        {
                            'featureType': 'local',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'railway',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'railway',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#08304b'
                            }
                        },
                        {
                            'featureType': 'subway',
                            'elementType': 'geometry',
                            'stylers': {
                                'lightness': -70
                            }
                        },
                        {
                            'featureType': 'building',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'all',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#857f7f'
                            }
                        },
                        {
                            'featureType': 'all',
                            'elementType': 'labels.text.stroke',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'building',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#022338'
                            }
                        },
                        {
                            'featureType': 'green',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#062032'
                            }
                        },
                        {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#465b6c'
                            }
                        },
                        {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#022338'
                            }
                        },
                        {
                            'featureType': 'label',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }
                    ]
                }
            },
            timeline: {
                axisType: 'category',
                orient: 'horizontal',
                autoPlay: false,
                inverse: true,
                //playInterval: Math.round(1000 * 600 * ratio),
                playInterval: Math.round(1000 * 10 * 6),
                left: 30,
                right: 30,
                top: null,
                bottom: 30,
                width: null,
                height: 55,
                inverse: false,
                label: {
                    position: 10,
                    normal: {
                        //interval: 1,
                        textStyle: {
                            color: '#999'
                        },
                        //rotate: 60,
                        formatter: function(value, index) {
                            // console.log("时间线：",value,index);
                            var texts = [value.slice(-4, -2), value.slice(-2)];
                            if (index % 3 == 1 || index % 3 == 2) {
                                texts.shift();
                                texts.shift();
                            }
                            return texts.join(':');
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                symbol: 'pin',
                symbolSize: 10,
                lineStyle: {
                    color: '#555'
                },
                checkpointStyle: {
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 2
                },
                controlStyle: {
                    showNextBtn: true,
                    showPrevBtn: true,
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: []
            },
            series: [
                {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: busLines,//
                    silent: false,
                    lineStyle: {
                        normal: {
                            opacity: 0.2,
                            width: 1 //拖动时影子
                        }
                    },
                    progressiveThreshold: 500,
                    progressive: 200
                }, {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: busLines,
                    lineStyle: {
                        normal: {
                            width: 0//一条路的整体模型覆盖
                        }
                    },
                    effect: {
                        constantSpeed: 30,//小点的速度
                        show: true,
                        trailLength: 0.1,
                        symbolSize: 4.5
                        // color:''
                    },
                    zlevel: 1
                }
            ]
        },
        options: []
    }

    //美化时间轴
    var timelines = [201805080000,201805080010,201805080020,201805080030,201805080040,201805080050,
        201805080100,201805080110,201805080120,201805080130,201805080140,201805080150,
        201805080200,201805080210,201805080220,201805080230,201805080240,201805080250,
        201805080300,201805080310,201805080320,201805080330,201805080340,201805080350,
        201805080400,201805080410,201805080420,201805080430,201805080440,201805080450,
        201805080500,201805080510,201805080520,201805080530,201805080540,201805080550,
        201805080600,201805080610,201805080620,201805080630,201805080640,201805080650,
        201805080700,201805080710,201805080720,201805080730,201805080740,201805080750,
        201805080800,201805080810,201805080820,201805080830,201805080840,201805080850,
        201805080900,201805080910,201805080920,201805080930,201805080940,201805080950,
        201805081000,201805081010,201805081020,201805081030,201805081040,201805081050,
        201805081100,201805081110,201805081120,201805081130,201805081140,201805081150,
        201805081200,201805081210,201805081220,201805081230,201805081240,201805081250,
        201805081300,201805081310,201805081320,201805081330,201805081340,201805081350,
        201805081400,201805081410,201805081420,201805081430,201805081440,201805081450,
        201805081500,201805081510,201805081520,201805081530,201805081540,201805081550,
        201805081600,201805081610,201805081620,201805081630,201805081640,201805081650,
        201805081700,201805081710,201805081720,201805081730,201805081740,201805081750,
        201805081800,201805081810,201805081820,201805081830,201805081840,201805081850,
        201805081900,201805081910,201805081920,201805081930,201805081940,201805081950,
        201805082000,201805082010,201805082020,201805082030,201805082040,201805082050,
        201805082100,201805082110,201805082120,201805082130,201805082140,201805082150,
        201805082200,201805082210,201805082220,201805082230,201805082240,201805082250,
        201805082300,201805082310,201805082320,201805082330,201805082340,201805082350
    ];
    for (var i = 0; i < timelines.length; i ++) {
        if (i % 6 === 0) {
            var time = {
                value:timelines[i],
                symbol: "diamond"
            }
            option.baseOption.timeline.data.push(time);
        }else {
            option.baseOption.timeline.data.push(timelines[i]);
        }
    }
    myChart.setOption(option);
    //车辆和道路对应的颜色

    //时间点的最初位置
    var initIndex = (getYearMonthDay().hour*6 + Math.floor(getYearMonthDay().minute/10));
    myChart.dispatchAction({
        type:'timelineChange',
        //判断当前时间
        currentIndex: initIndex,
    })

    //每个时间段对应的 数据变化End
    var timeKeys = [
        {'0':'00:00'},{'1':'00:10'},{'2':'00:20'},{'3':'00:30'},{'4':'00:40'},{'5':'00:50'},
        {'6':'01:00'},{'7':'01:10'},{'8':'01:20'},{'9':'01:30'},{'10':'01:40'},{'11':'01:50'},{'12':'02:00'},
        {'13':'02:10'},{'14':'02:20'},{'15':'02:30'},{'16':'02:40'},{'17':'02:50'},{'18':'03:00'},{'19':'03:10'},
        {'20':'03:20'},{'21':'03:30'},{'22':'03:40'},{'23':'03:50'},{'24':'04:00'},{'25':'04:10'},{'26':'04:20'},
        {'27':'04:30'},{'28':'04:40'},{'29':'04:50'},{'30':'05:00'},{'31':'05:10'},{'32':'05:20'},{'32':'05:30'},
        {'34':'05:40'},{'35':'05:50'},{'36':'06:00'},{'37':'06:10'},{'38':'06:20'},{'39':'06:30'},{'40':'06:40'},
        {'41':'06:50'},{'42':'07:00'},{'43':'07:10'},{'44':'07:20'},{'45':'07:30'},{'46':'07:40'},{'47':'07:50'},
        {'48':'08:00'},{'49':'08:10'},{'50':'08:20'},{'51':'08:30'},{'52':'08:40'},{'53':'08:50'},{'54':'09:00'},
        {'55':'09:10'},{'56':'09:20'},{'57':'09:30'},{'58':'09:40'},{'59':'09:50'},{'60':'10:00'},{'61':'10:10'},
        {'62':'10:20'},{'63':'10:30'},{'64':'10:40'},{'65':'10:50'},{'66':'11:00'},{'67':'11:10'},{'68':'11:20'},
        {'69':'11:30'},{'70':'11:40'},{'71':'11:50'},{'72':'12:00'},{'73':'12:10'},{'74':'12:20'},{'75':'12:30'},
        {'76':'12:40'},{'77':'12:50'},{'78':'13:00'},{'79':'13:10'},{'80':'13:20'},{'81':'13:30'},{'82':'13:40'},
        {'83':'13:50'},{'83':'14:00'},{'85':'14:10'},{'86':'14:20'},{'87':'14:30'},{'88':'14:40'},{'89':'14:50'},
        {'90':'15:00'},{'91':'15:10'},{'92':'15:20'},{'93':'15:30'},{'94':'15:40'},{'95':'15:50'},{'96':'16:00'},
        {'97':'16:10'},{'98':'16:20'},{'99':'16:30'},{'100':'16:40'},{'101':'16:50'},{'102':'17:00'},{'103':'17:10'},
        {'104':'17:20'},{'105':'17:30'},{'106':'17:40'},{'107':'17:50'},{'108':'18:00'},{'109':'18:10'},{'110':'18:20'},
        {'111':'18:30'},{'112':'18:40'},{'113':'18:50'},{'114':'19:00'},{'115':'19:10'},{'116':'19:20'},{'117':'19:30'},
        {'118':'19:40'},{'119':'19:50'},{'120':'20:00'},{'121':'20:10'},{'122':'20:20'},{'123':'20:30'},{'124':'20:40'},
        {'125':'20:50'},{'126':'21:00'},{'127':'21:10'},{'128':'21:20'},{'129':'21:30'},{'130':'21:40'},{'131':'21:50'},
        {'132':'22:00'},{'133':'22:10'},{'134':'22:20'},{'135':'22:30'},{'136':'22:40'},{'137':'22:50'},{'138':'23:00'},
        {'139':'23:10'},{'140':'23:20'},{'141':'23:30'},{'142':'23:40'},{'143':'23:50'},{'144':'24:00'}];

    myChart.on('timelinechanged',function (param) {//timelinechanged
        identifier = param.currentIndex;

        var param_time = timeKeys[identifier][identifier]+':00' +"_"+ timeKeys[identifier+1][identifier+1]+":00";

        // var param_year = getYearMonthDay();
        console.log('拿取时间：',param_time);
        // fillOptions(identifier);

        //重新加载
        getTipData(param_time);
        myChart.setOption(option);
    });
    // 添加百度地图插件Start
    if (!app.inNode) {
        bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        }));

        // bmap.disableDoubleClickZoom(false);`
        bmap.enableScrollWheelZoom(true);

    };
    totalLines = busLines;
    // 路段覆盖物
    requestCrossData(busLines);
}
/**
 * 描路口监控器cross_data
 * */
function requestCrossData(busLines) {
    $.ajax({
        type: "post",//使用get方法访问后台
        dataType: "json",//返回json格式的数据
        url: url+"/TrafficShowWeb/gps/loadGPS",
        data: {},//要发送的数据
        success: function (cross_data) {
            //监控数据 传 crossDatas
            crossDatas = cross_data.data;
            // console.log("监控数据：",crossDatas);
            initCrossShow(crossDatas);
            getTipData();
        },
        error: function (error) {
            console.log("error:" + error);
        }
    });
}
/**
 * 在地图上标注信息
 * */
var opts = {
    width : 0,     // 信息窗口宽度
    height: 0,     // 信息窗口高度
    title : "<div style=''>"+'路口信息'+"</div>" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
//路段标注信息
var roadopts = {
    width: 0,
    height: 0,
    title: "<div style=''>"+'路段信息'+"</div>",
    enableMessage:true
}
/**
 *  请求拥堵指数
 * */
function getTipData(time) {
    if (time == undefined||time == '') {
        var initMinute = getYearMonthDay().minute/10;
        var initHour = getYearMonthDay().hour;

        if (initMinute  % 1 == 0){//为整数
            var initTime_start = initHour + ':' + Math.floor(initMinute)*10+':00';
            if (initMinute == 5){
                var initTime_end = initHour +1 + ':00'+':00';
            }else {
                var initTime_end = initHour + ':' + Math.ceil(initMinute + 1)*10+':00';
            }
            // console.log("为整：",initTime_end);
        }else {
            var initTime_start = initHour + ':' + Math.floor(initMinute)*10+':00';
            if (initMinute < 1) {
                var initTime_start = initHour + ':00' +':00';
            }
            if (initMinute >= 5) {
                var initTime_end = initHour +1 + ':00' +':00';
            }else {
                var initTime_end = initHour + ':' + Math.ceil(initMinute)*10+':00';
            }
            console.log("不为整：",initTime_end);
        }
        objDate.time = "2018-01-01"+' '+ initTime_start+'_'+ initTime_end;
        console.log("为空：",objDate.time);
    }else {
        objDate.time = "2018-01-01"+' '+ time;
        // console.log("不为空：",objDate.time);
    }
    $.ajax({
        type: "post",//使用get方法访问后台
        dataType: "json",
        url:url+"/TrafficShowWeb/tpi/loadTpi",
        data:{timePart: objDate.time},
        success: function (TipLists) {
            // console.log("拥堵指数时间：",objDate.time);
            // console.log("拥堵指数s：",TipLists);

            var TipLists  = TipLists.data.list;
            //方法 传递两个返回结果的参数
            initTipFunction(TipLists,objDate.time);
        },
        error: function () {
            console.log("error:" + error);
        }
    });
}
/**
 * 拥堵指数 和 改变路段颜色
 * */
function initTipFunction(TipLists,time) {
    /**
     *处理监控点数据 和 路段数据
     */
    bmap.removeOverlay();
    //描绘线段 busLines
    // console.log("描绘线段totalLines--:",totalLines);
    // document.getElementById("test3").innerHTML = JSON.stringify(totalLines);

    var roadColor = "";
    for (var i = 0; i < totalLines.length; i ++) {
        var list = new Array();//存放点（包含经纬度) 组成一条线
        for (var n = 0; n < TipLists.length; n ++) {
            if (TipLists[n]["line"] == totalLines[i]["lines"]) {
                // console.log("相同的",TipLists[n]["line"]);
                var tpi = TipLists[n]["tpi"];
                if (tpi == 1) {
                    roadColor = "green";
                }
                if (tpi == 2) {
                    roadColor = '#7CBD00';
                }
                if (tpi == 3) {
                    roadColor = "yellow";
                }
                if (tpi == 4) {
                    roadColor = "#FF7E00";
                }
                if (tpi == 5) {
                    roadColor = "red";
                }
            }
        }
        for(var j = 0; j < totalLines[i].coords.length; j ++){
            //描路段的点
            list.push(new BMap.Point(totalLines[i].coords[j][0],totalLines[i].coords[j][1]));
        }
        var polyline = new BMap.Polyline(list,{//一条线
            strokeColor: roadColor,
            strokeWeight:5,
            strokeOpacity:0.5
        });

        polyline.start_end = totalLines[i]["lines"];
        polyline.index_i = i;
        bmap.addOverlay(polyline);
        polyline.addEventListener("click",function () {
            console.log("移除了线路",polyline);
        });
        AddRoadInfo(polyline,time);
    }
}
/**
 * 路段弹窗function
 * */
function AddRoadInfo(polyline,timePart) {

    polyline.addEventListener("click",function(){
        console.log("polyline1:",polyline);
    });
    if (polyline.index_i == 0) {
        console.log("polyline:",polyline);
    }

    /* polyline.addEventListener("click",function () {//mouseover
         $.ajax({
             type: "post",//使用get方法访问后台
             dataType: "json",
             url:url+"/TrafficShowWeb/speed/speedBothway",
             data:{line:this.start_end,timePart:timePart},
             success: function (data) {
                 if (data.code == 200) {
                     var data = data.data.list;
                     // console.log("点击路段信息：",data);
                     var roadArr = new Array();
                     //data[i]["lineName"]
                     for (var i = 0; i < data.length; i ++) {
                         roadArr.push('<div id="roadinfo">');
                         roadArr.push('<ul class="roadname">');
                         roadArr.push('<li class="fl tec">'+' 路段名称' +'</li>');
                         roadArr.push('<li class="fl tec">'+ '北京西路北京范德萨发顺丰' +'</li>');
                         roadArr.push('</ul>');
                         roadArr.push('<ul class="roadnumber">');
                         roadArr.push('<li class="fl tec">'+' 路段编号' +'</li>');
                         roadArr.push('<li class="fl tec">'+ data[i]["line"] +'</li>');
                         // roadArr.push('<li class="fl tec">'+ '交通总流量' +'</li>');
                         // roadArr.push('<li class="fl tec">'+ '1233辆' +'</li>');
                         roadArr.push('</ul>');
                         roadArr.push('<table id="table">');
                         roadArr.push('<tr id="th">')
                         roadArr.push('<th>方向</th>\n' +
                             '                         <th>平均速度（公里/小时）</th>\n' +
                             '                         <th>平均旅行时间（分）</th>\n' +
                             '                         <th>过车量（辆）</th>');
                         roadArr.push('</tr>');
                         var direction;
                         for (var i = 0; i < 2; i ++) {
                             if (i == 0) {
                                 direction = "正向";
                             }
                             if (i == 1) {
                                 direction = "逆向";
                             }
                             roadArr.push('<tr>');
                             roadArr.push('<td>'+direction+'</td>');
                             roadArr.push('<td>'+data[i]["avg_speed"]+'</td>');
                             roadArr.push('<td>'+data[i]["avg_time"]+'</td>');
                             roadArr.push('<td>'+data[i]["effective"]+'</td>');
                             roadArr.push('</tr>');
                         }
                         roadArr.push('</table>');
                         roadArr.push('</div>');
                     }
                     var roadContent = roadArr.join("");
                     openRoadInfo(roadContent,e);
                 }
             },
             error: function () {
                 console.log("error:" + error);
             }
         });
     })*/
}
//打开路段窗口
function openRoadInfo(roadContent,e) {
    var roadPoint = new BMap.Point(e.point.lng, e.point.lat);
    var infoWindow = new BMap.InfoWindow(roadContent,roadopts);  // 创建信息窗口对象
    bmap.openInfoWindow(infoWindow,roadPoint); //开启信息窗口
}
function initCrossShow(totalCrossDatas) {

    //描路口点 crossData
    var myIcon = new BMap.Icon("images/roadmark.png", new BMap.Size(30,30));
    for (var i = 0; i < totalCrossDatas.length; i ++) {
        //把有数据和无数据的点分开
        if(totalCrossDatas[i]["roadId"].indexOf("FLAG") < 0) {

        }else {
            myIcon = new BMap.Icon("images/roadmark2.png", new BMap.Size(30,30));
        }
        var marker = new BMap.Marker(new BMap.Point(totalCrossDatas[i]["lng"],totalCrossDatas[i]["lat"]),{icon:myIcon});
        var content = totalCrossDatas[i]["roadname"];
        bmap.addOverlay(marker);
        var code = totalCrossDatas[i]["roadId"];
        addClickHandler(content,marker,code);
    }
}
/**
 * 路口弹窗function
 * */
function  addClickHandler(content,marker,code){
    marker.addEventListener("click",function(e){//mouseover
        /**
         * 点击标注点
         * */
        $.ajax({
            type: "post",//使用get方法访问后台
            dataType: "json",//返回json格式的数据
            url:url+ "/TrafficShowWeb/flow/findOne",
            data: {address:code,timePart:objDate.time},//要发送的数据
            success: function (data) {
                console.log("路口数据：",data);
                if (data.data.list == null||data.data.list.length == 0) {
                    console.log("为空",content,code);
                    var arr = new Array();
                    // var datas = data.data.list[0].flowList;
                    arr.push('<div class="camera">');
                    arr.push('<ul class="roadname">');
                    arr.push('<li class="fl tec">'+' 路口名称' +'</li>');
                    arr.push('<li class="fl tec">'+ content +'</li>');
                    arr.push('</ul>');
                    arr.push('<ul class="roadnumber">');
                    arr.push('<li class="fl tec">'+' 路口编号' +'</li>');
                    arr.push('<li class="fl tec">'+ code +'</li>');
                    arr.push('<li class="fl tec">'+ '交通总流量' +'</li>');
                    arr.push('<li class="fl tec">'+ '未知' +'</li>');
                    arr.push('</ul>');
                    arr.push('<table id="table">');
                    arr.push('<tr id="th">')
                    arr.push('<th>车流来向</th>\n' +
                        '                         <th>左转（辆）</th>\n' +
                        '                         <th>直行（辆）</th>\n' +
                        '                         <th>右转（辆）</th>');
                    arr.push('</tr>');
                    var direction;
                    var testList = [1,2,3,4];
                    for (var i = 0; i < 4; i ++) {
                        if (testList[i] == 1) {
                            direction = "东向";
                        }
                        if (testList[i] == 2) {
                            direction = "西向";
                        }
                        if (testList[i] == 3) {
                            direction = "南向";
                        }
                        if (testList[i] == 4) {
                            direction = "北向";
                        }
                        arr.push('<tr>');
                        arr.push('<td>'+direction+'</td>');
                        arr.push('<td>'+'未知'+'</td>');
                        arr.push('<td>'+'未知'+'</td>');
                        arr.push('<td>'+'未知'+'</td>');
                        arr.push('</tr>');
                    }
                    arr.push('</table>');
                    arr.push('</div>');
                    var contents = arr.join("");

                    openInfo(contents,e);

                }else {
                    var datas = data.data.list[0].flowList;
                    var address_code = data.data.list[0].address;
                    var arr = new Array();
                    if (datas.length != 0){
                        arr.push('<div class="camera">');
                        arr.push('<ul class="roadname">');
                        arr.push('<li class="fl tec">'+' 路口名称' +'</li>');
                        arr.push('<li class="fl tec">'+ content +'</li>');
                        arr.push('</ul>');
                        arr.push('<ul class="roadnumber">');
                        arr.push('<li class="fl tec">'+' 路口编号' +'</li>');
                        arr.push('<li class="fl tec">'+ code +'</li>');
                        arr.push('<li class="fl tec">'+ '交通总流量' +'</li>');
                        arr.push('<li class="fl tec">'+ data.data.list[0].total +'辆'+'</li>');
                        arr.push('</ul>');
                        arr.push('<table id="table">');
                        arr.push('<tr id="th">')
                        arr.push('<th>车流来向</th>\n' +
                            '                         <th>左转（辆）</th>\n' +
                            '                         <th>直行（辆）</th>\n' +
                            '                         <th>右转（辆）</th>');
                        arr.push('</tr>');
                        var direction;
                        for (var i = 0; i < datas.length; i ++) {
                            if (datas[i]["direction"] == 1) {
                                direction = "东向";
                            }
                            if (datas[i]["direction"] == 2) {
                                direction = "西向";
                            }
                            if (datas[i]["direction"] == 3) {
                                direction = "南向";
                            }
                            if (datas[i]["direction"] == 4) {
                                direction = "北向";
                            }
                            arr.push('<tr>');
                            arr.push('<td>'+direction+'</td>');
                            arr.push('<td>'+datas[i]["left"]+'</td>');
                            arr.push('<td>'+datas[i]["straight"]+'</td>');
                            arr.push('<td>'+datas[i]["right"]+'</td>');
                            arr.push('</tr>');
                        }
                        arr.push('</table>');
                        arr.push('</div>');
                        var contents = arr.join("");

                        openInfo(contents,e);
                    }else {
                        var contents = "<div>" +
                            "<h4>"+ content +"</h4>"+
                            "<p>"+ "<span>" +"暂无数据"+"<span>" +"<p>"
                            + "</div>"
                        openInfo(contents,e);
                    }
                }
            },
            error: function (error) {
                console.log("error:" + error);
            }
        })
    });
}
//打开路口窗口
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    bmap.openInfoWindow(infoWindow,point); //开启信息窗口
}


/**
 * 有关左上角检索的操作
 * */
//切换交通条件操作
$(".item-select").find(".select:first").show();    //为每个BOX的第一个元素显示

$(".search-item li").on("click",function(){ //给li标签添加事件
    var index = $(this).index();  //获取当前li标签的个数
    var test =  $(this).parent().next();

    //返回上一层，在下面查找css名为box隐藏，然后选中的显示
    $(this).parent().next().find(".select").hide().eq(index).show();
    $(this).addClass("active").siblings().removeClass("active"); //a标签显示，同辈元素隐藏
});
//操作左边日历
var current_time = getYearMonthDay();
var current_time = current_time.year+'-'+current_time.month+'-'+current_time.day+' '+current_time.hour+':'+current_time.minute+':00'
$("#current-time").text(current_time);
function timeOnChange() {
    current_time = $("#time-select").val();
    $("#current-time").text(current_time);
}

/**
 * 获取当前的年月日 时分
 */
function getYearMonthDay() {
    var timeObj = {};
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    month = month < 10?'0'+month:month;
    var day = currentDate.getDate();
    day = day < 10?'0'+day:day;
    var hour = currentDate.getHours();
    hour = hour < 10?'0'+hour:hour;
    var minute = currentDate.getMinutes();
    minute = minute < 10?'0'+minute:minute;
    timeObj.year = year;
    timeObj.month = month;
    timeObj.day = day;
    timeObj.hour = hour;
    timeObj.minute = minute;
    return timeObj;
}
