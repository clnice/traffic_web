<!--地图-->
<!--echart描点-->
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
//一些参数
var ratio = 60 / 600;//比例
var app = {};
var bmap = {};
var map = {};
var option = null;
app.title = '贵阳交通系统 - 线特效';

//所有路段的点信息和其他车辆信息
var busLines = [
        {"coords":[
                [106.616486,26.680403],
                [106.616661,26.682041],
                [106.616883,26.683299],
                [106.617068,26.684094],
                [106.617342,26.685203],
                [106.61781,26.686585],
                [106.618084,26.687654],
                [106.618572,26.688872],
                [106.619026,26.689776],
                [106.619363,26.690518],
                [106.619917,26.691663],
                [106.620371,26.692458],
                [106.620712,26.693127],
                [106.620959,26.693607],
                [106.621544,26.694389],
                [106.621827,26.694832],
                [106.623733,26.696751],
                [106.624335,26.697288],
                [106.624923,26.697687],
                [106.625633,26.698111],
                [106.626877,26.698752],
                [106.627869,26.699172],
                [106.628723,26.699454],
                [106.629486,26.699676],
                [106.630218,26.699859],
                [106.630663,26.699923]
            ],"lines":"#BY015-#BY012"},
        {"coords":[
                [106.684135,26.436609],
                [106.684099,26.435978],
                [106.684027,26.435461],
                [106.684081,26.43504],
                [106.684063,26.434458],
                [106.684117,26.434118]], "lines":"#HX005-#HX002"},
        {"coords":[
                [106.684099,26.436608],
                [106.683147,26.436446],
                [106.682455,26.436341]
            ],"lines":"#HX005-#HX001"},
        {"coords":[
                [106.684575,26.434126],
                [106.684485,26.434732],
                [106.684431,26.435169],
                [106.684485,26.435768],
                [106.68444,26.436763]], "lines":"#HX002-#HX005"}
        ,{"coords":[
            [106.724204,26.580681],
            [106.723305,26.580536],
            [106.722245,26.580374],
            [106.721509,26.580221],
            [106.720512,26.57997],
            [106.719569,26.579793],
            [106.719308,26.579773]], "lines":"#NM027-#NM003"},
        {"coords":[
                [106.630664,26.640086],
                [106.630668,26.639969],
                [106.630835,26.639651],
                [106.631223,26.637501],
                [106.631344,26.636181],
                [106.631175,26.634454],
                [106.630938,26.633465]], "lines":"#GS009-#GS060"},
        {"coords":[
                [106.631364,26.640422],
                [106.631817,26.640402],
                [106.632442,26.640402],
                [106.633331,26.640341],
                [106.635199,26.640353],
                [106.636692,26.640367],
                [106.637999,26.640379],
                [106.639455,26.640379],
                [106.641422,26.640387],
                [106.642976,26.640359],
                [106.644697,26.640416],
                [106.647724,26.64058],
                [106.649979,26.640706],
                [106.652414,26.64088],
                [106.653407,26.640957]],"lines":"#GS009-#GS010"}
];
//所以监控点
var totalCrossDatas= [
    {"lat":"26.680301","lng":"106.616346","roadId":"#BY015","roadname":"南湖路与云环路交叉口"},
    {"lat":"26.551376","lng":"106.715799","roadId":"#NM032","roadname":"朝阳洞路与望城路交叉口"},
    {"lat":"26","lng":"106","roadId":"123","roadname":"贵阳"},
    {"lat":"26.436799005794","lng":"106.68407499995","roadId":"#HX005","roadname":"清溪路与贵筑路交叉口"},
    {"lat":"26.580452979621","lng":"106.72394608612","roadId":"#NM027","roadname":"都司高架路与护国路交叉口"},
    {"lat":"26.64047","lng":"106.630871","roadId":"#GS009","roadname":"观山西路与金阳南路交叉口"},
    {"lat":"26.436043448554","lng":"106.67205029462","roadId":"#HX007","roadname":"甲秀南路与迎宾路交叉口"},
    {"lat":"26.421290738009","lng":"106.66224609337","roadId":"#HX008","roadname":"甲秀南路与新区大道交叉口"},
    {"lat":"26.435752445728","lng":"106.67285209164","roadId":"#HX010","roadname":"甲秀南路与贵筑路交叉口"},
    {"lat":"26.600623","lng":"106.655708","roadId":"#GS017","roadname":"北京西路与长岭南路交叉口"}]
//初始化 echart 和 地图
initLineFunction();

function initLineFunction() {
    option = {
        baseOption:{
            bmap: {
                center: [106.646914, 26.635041],
                zoom: 14,
                roam: 'true',
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
                    //zlevel: 1
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

        myChart.setOption(option);
    });
    // 添加百度地图插件Start
    if (!app.inNode) {
        bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        }));
        bmap.enableScrollWheelZoom(true);
    };
}
/**
 * 线段的覆盖物
 * */
initTipFunction()
function initTipFunction() {
    /**
     *处理监控点数据 和 路段数据
     */
    bmap.removeOverlay();

    //描绘线段 busLines
    // document.getElementById("test3").innerHTML = JSON.stringify(TipLists);

    for (var i = 0; i < busLines.length; i ++) {
        var list = new Array();//存放点（包含经纬度) 组成一条线
        for(var j = 0; j < busLines[i].coords.length; j ++){
            //描路段的点
            list.push(new BMap.Point(busLines[i].coords[j][0],busLines[i].coords[j][1]));
        }
        var polyline = new BMap.Polyline(list,{//一条线
            strokeColor: 'blue',
            strokeWeight:15,
            strokeOpacity:0.5,
            ZIndex: 9
        });

        polyline.start_end = busLines[i]["lines"];
        polyline.index_i = i;
        bmap.addOverlay(polyline);
        AddRoadInfo(polyline);
    }
}
/**
 * 路段弹窗function
 * */
function AddRoadInfo(polyline) {

    polyline.addEventListener("click",function(e){//click
        console.log("执行:");
    });
}
/**
 * 路口监控
 * */
initCrossShow();
function initCrossShow() {

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
    marker.addEventListener("click",function(e){//
        console.log("点击Mark，这里可以执行");
    });
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

