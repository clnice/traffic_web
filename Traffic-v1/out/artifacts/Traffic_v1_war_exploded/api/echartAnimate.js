    <!--地图-->
    <!--echart描点-->
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
//一些参数
var ratio = 60 / 600;//比例
var app = {};
var bmap;
var manual = false;//手册
var identifier=0;//标识符
var limitOfCars = 20;//限制
option = null;
app.title = '北京公交路线 - 线特效';
//描绘路段颜色的点集
var roadDatas = [];
$.get('./data/bus.json', function(data) {

    var schema = [{
        index: 1,
        text: '平均车速',
        unit: 'km/h'
    }];
    var hStep = 300 / (data.length - 1);
    var busLines = [].concat.apply([], data.lines.map(function (busLine, idx) {
        var prevPt;
        var points = [];
        for (var i = 0; i < busLine.length; i += 2) {
            var pt = [busLine[i], busLine[i + 1]];
            points.push([pt[1], pt[0]]);
        }
        roadDatas = points;
        //返回点集
        return {
            coords: points,
            lineStyle: {
                normal: {
                    color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
                }
            }
        };
    }));
    // console.log("点：",busLines);
    option = {
        baseOption:{
            bmap: {
                center: [106.646914, 26.635041],
                zoom: 15,
                roam: true,
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
                autoPlay: true,
                inverse: true,
                playInterval: Math.round(1000 * 600 * ratio),
                left: 80,
                right: 80,
                top: null,
                bottom: 0,
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
                symbol: 'diamond',
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
                    data: busLines,
                    silent: true,
                    lineStyle: {
                        normal: {
                            opacity: 0.2,
                            width: 1
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
                            width: 0
                        }
                    },
                    effect: {
                        constantSpeed: 20,
                        show: true,
                        trailLength: 0.1,
                        symbolSize: 2.5
                    },
                    zlevel: 1
                }
            ]
        },
        options: []
    }
    myChart.setOption(option);

    //设置地图的option, 使其成功加载在网页上面(当然，还得等到setoption之后); 随着时间更新会重复调用此函数。
    function fillOptions(identifier) {
        option.options.length = 0;
        for (var n = 0; n < data.timelines.length; n++) {
            var timelineString = data.timelines[n].toString();
            //往地图的option中循环添加对应timeline中各个时刻的数据
            option.options.push({
                title: {
                    show: true,
                    left: 20,
                    right: null,
                    top: 20,
                    bottom: null,//-4指倒数第4个，-2指倒数第2个
                    text: ('   ' + timelineString.slice(-4, -2) + ' : ' + timelineString.slice(-2)),
                    textStyle: {
                        color: '#fff'
                    },
                    subtext: (timelineString.slice(0, 4) + '年' + timelineString.slice(4, 6) + '月' + timelineString.slice(6, 8) + '日')
                },
                tooltip: {
                    padding: 5,
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    formatter: function(obj) {
                        if (obj.componentType === "timeline") {
                            var value = obj.name;
                            var texts = [value.slice(-4, -2), value.slice(-2)];
                            return texts.join(':');
                        } else if (obj.componentSubType === "lines") {
                            return obj.name;
                        }
                    }
                },
                series: (function(busLines) {
                    //判断是否当前时间
                    if (n == identifier) {
                        var series = [{
                            type: 'lines',
                            coordinateSystem: 'bmap',
                            polyline: true,
                            data: (function(busLines) { //添加道路
                                var busLines_new = [];
                                for (var i = 0; i < busLines.length; i++) {
                                    var name = schema[0].text + '：' + data.series[n][i][1] + schema[0].unit;
                                    var lineStyle = {
                                        normal: {
                                            opacity: 0.3,
                                            width: 5,
                                            curvness: 1
                                        }
                                    };
                                    switch (data.series[n][i][2]) {
                                        case 1: //绿色
                                            lineStyle.normal.color = 'green';
                                            break;
                                        case 2: //黄色
                                            lineStyle.normal.color = 'yellow';
                                            break;
                                        case 3: //红色
                                            lineStyle.normal.color = 'red';
                                            break;
                                        case 4: //灰色
                                            lineStyle.normal.color = 'gray';
                                            break;
                                    }

                                    busLines_new[i] = {};
                                    busLines_new[i].name = name;
                                    busLines_new[i].coords = busLines[i].coords; //0~xxx
                                    busLines_new[i].lineStyle = lineStyle;
                                }
                                return busLines_new;
                            })(busLines),
                            zlevel: 2,
                            silent: false,
                            progressiveThreshold: 50,
                            progressive: 20
                        }];
                        //下面是加添加道路上点移动的effect，Note: 每条道路的effect多次添加等同于车辆的数目的次数
                        for (var i = 0; i < busLines.length; i++) {
                            //每条道路速度不同
                            var line = [];
                            line.push(busLines[i]);
                            //limitOfCars = 20
                            var numberOfCars = (data.series[n][i][0] < limitOfCars ? data.series[n][i][0] : limitOfCars);
                            //每条道路插入多次,代表多辆汽车
                            for (var j = 0; j < limitOfCars; j++) {
                                if (j < numberOfCars) {
                                    series.push({
                                        type: 'lines',
                                        coordinateSystem: 'bmap',
                                        polyline: true,
                                        data: line,
                                        effect: {
                                            constantSpeed: Math.round(data.series[n][i][1]*118/1000) + Math.random() * 10,
                                            show: true,
                                            trailLength: 0,
                                            symbolSize: 3,
                                            animation: false,
                                            color: (data.series[n][i][2] == 1)? 'green': (data.series[n][i][2] == 2) ? 'yellow' : (data.series[n][i][2] == 3)? 'red': 'gray'
                                        },
                                        zlevel: 1,
                                        silent: true
                                    });
                                } else {
                                    //清除多余的点，降低浏览器前段资源占用
                                    series.push({
                                        type: 'lines',
                                        coordinateSystem: 'bmap',
                                        polyline: true,
                                        data: line,
                                        effect: {
                                            constantSpeed: 0,
                                            show: true,
                                            trailLength: 0,
                                            symbolSize: 0,
                                            animation: false,
                                        },
                                        zlevel: 1
                                    });
                                }
                            }
                        }
                    } else {
                        //当前timeline显示的时间不是正在添加的时间，于是将series置成空，避免消耗资源
                        var series = [];
                    }
                    return series;
                })(busLines)
            });
        }
    };
    //设置地图option  End

    var roadPieOption = {
        title: {
            text: '道路拥堵状况',
            x: 'center'
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
        },
        calculable: true,
        series: [{
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: "{b}的道路:"+"\n"+"{c}条({d}%)"
                    },
                    labelLine: { show: true }
                }
            },
            type: 'pie',
            radius: [40, 110],
            center: ['50%', '50%'],
            roseType: 'radius',
            data: []
        }]
    }
    var carsPieOption = {
        title: {
            text: '车辆拥堵状况',
            x: 'center'
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5']
        },
        calculable: true,
        series: [{
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        formatter: "{b}的车辆总数:"+"\n"+"{c}辆({d}%)"
                    },
                    labelLine: { show: true }
                }
            },
            type: 'pie',
            radius: [40, 110],
            center: ['50%', '50%'],
            roseType: 'radius',
            data: []
        }]
    }

    //设置两个饼状图的option, 使其成功加载在网页上面（当然，还得等到setoption之后）; 随着时间更新会重复调用此函数。
    function fillPieOption(identifier){
        roadPieOption.series[0].data.length = 0;
        carsPieOption.series[0].data.length = 0;

        roadPieOption.series[0].data.push(
            {value:data.roadColor[identifier][0],name:"速度>36km/h",itemStyle:{normal: {color: '#00CC33'}}},
            { value: data.roadColor[identifier][1], name: "30~36km/h", itemStyle: { normal: { color: '#FF9900' } } },
            { value: data.roadColor[identifier][2], name: "速度<30km/h", itemStyle: { normal: { color: '#FF0000' } } },
            {value:data.roadColor[identifier][3],name:"无数据",itemStyle:{normal: {color: '#CCCCCC '}}}
        );
        carsPieOption.series[0].data.push(
            { value: data.carsColor[identifier][0], name: "速度>36km/h", itemStyle: { normal: { color: '#00CC33' } } },
            { value: data.carsColor[identifier][1], name: "30~36km/h", itemStyle: { normal: { color: '#FF9900' } } },
            { value: data.carsColor[identifier][2], name: "速度<30km/h", itemStyle: { normal: { color: '#FF0000' } } }
        );
    }
    //时间监听。当timeline时刻发生变化时，调用更新函数fillOptions和fillPieOption
    myChart.on('timelinechanged', function(param) {
        identifier = param.currentIndex;
        fillOptions(identifier);

        myChart.setOption(option);
    });
    //特殊情况：应展示的需要，初始化时将时间设置为08：00。
    myChart.dispatchAction({
        type: 'timelineChange',
        // 时间点的 index
        currentIndex: 48
    });
    fillOptions(48);
    myChart.setOption(option);

    // 添加百度地图插件Start ====================================
    if (!app.inNode) {
        bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        }));
        bmap.addEventListener("click", showInfo);
    };
    var gpsList = new Array();
    function showInfo(e) {
        // console.log(e.point.lng + ", " + e.point.lat);
        gpsList.push(e.point.lat,e.point.lng);
        showDatapoint(gpsList);
    }
    function showDatapoint(data) {
        var strdiv = "";
        // var pointArr = new Array();
        for (var i = 0; i < data.length; i +=2) {
            strdiv = '<p>'+data[i]+','+data[i + 1]+'</p>'
            // pointArr.push(data[i],data[i+1]);
        }
        $(".show-point > #pale").append(strdiv);
    }
    $(".clearBtn").click(function () {
        console.log("删除");
        gpsList = [];
        $(".show-point > #pale > p").remove();
        $("#linedata").val("");
    })
    //向后端发送经纬度数组
    $(".addBtn").click(function () {
       console.log("添加",JSON.stringify(gpsList));
       // alert(JSON.stringify(gpsList));
        $.ajax({
            type: "post",//使用get方法访问后台
            traditional: true,//属性在这里设置,这里是需要添加数组
            dataType: "json",//返回json格式的数据
            url:url+"/TrafficShowWeb/gps/lineGPSBuilder",
            // url: "../data/bus2.json",
            // data:JSON.stringify(gpsList),
            data:{"gpsList":JSON.stringify(gpsList),"line":$("#linedata").val()},
            success: function (data) {
                alert("data:"+data.msg);
            },
            error: function (error) {
                console.log("error:" + error);
            }

        });
    });
    /**
     * 加载j监控数据
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
        title : "<div style=''>"+'路口信息'+"</div>" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    console.log("averageSpeed:",data.averageSpeed.length)
    function initData(data) {
        bmap.removeOverlay();

        //console.log("路的条数:",busLines.length);//路的条数
        //console.log("每条路的点数:",busLines[0].coords);//每条路的点数
        //console.log("每个点的坐标:",busLines[0].coords[0]);//每个点的坐标

        var polyList = new Array();
        for (var i = 0; i < busLines.length; i ++) {
            var list = new Array();
            for(var j = 0; j < busLines[i].coords.length; j ++){
                //描路段的点
                list.push(new BMap.Point(busLines[i].coords[j][0],busLines[i].coords[j][1]));
            }

            var polyline = new BMap.Polyline(list,{strokeColor:"yellow", strokeWeight:5, strokeOpacity:0.5});
            polyList.push(polyline);
        }
        console.log(polyList.length);


        /*//描路段的点
        var polyline = new BMap.Polyline([
            new BMap.Point(106.630924, 26.640531),
            new BMap.Point(106.63524, 26.645936),
            new BMap.Point(106.6399924, 26.640531)
        ], {strokeColor:"yellow", strokeWeight:5, strokeOpacity:0.5});   //创建折线*/
        for(var i = 0; i < polyList.length; i ++){
            bmap.addOverlay(polyList[i]);
            polyline.addEventListener("click",function (e) {
                var p = marker.getPosition();       //获取marker的位置
                console.log("marker的位置是" + p.lng + "," + p.lat);
            });
        }
        //描路口点
        var myIcon = new BMap.Icon("images/roadmark.png", new BMap.Size(30,30));
        for (var i = 0; i < data.length; i ++) {
            var marker = new BMap.Marker(new BMap.Point(data[i]["lng"],data[i]["lat"]),{icon:myIcon});
            var content = data[i]["roadname"];
            bmap.addOverlay(marker);
            var code = data[i]["roadId"];
            addClickHandler(content,marker,code)
        }
    }
    function  addClickHandler(content,marker,code){
        var time = "2018-01-01 08:05:00_08:10:00";
        marker.addEventListener("click",function(e){
            /**
             * 点击标注点
             * */
            $.ajax({
                type: "post",//使用get方法访问后台
                dataType: "json",//返回json格式的数据
                // url: "http://192.168.100.245:8080/TrafficShowWeb/flow/findRegexRow",
                url:url+ "/TrafficShowWeb/flow/findOne",
                data: {address:code,timePart:time},//要发送的数据
                success: function (data) {
                    console.log("data:",data);
                    var datas = data.data.list;
                    var arr = new Array();
                    if (datas.length != 0){

                        arr.push('<div class="camera">');
                        arr.push('<ul class="roadname">');
                        arr.push('<li class="fl tec">'+' 路口名称' +'</li>');
                        arr.push('<li class="fl tec">'+ content +'</li>');
                        arr.push('</ul>');
                        arr.push('<ul class="roadnumber">');
                        arr.push('<li class="fl tec">'+' 路口编号' +'</li>');
                        arr.push('<li class="fl tec">'+ 'GS002' +'</li>');
                        arr.push('<li class="fl tec">'+ '交通总流量' +'</li>');
                        arr.push('<li class="fl tec">'+ '1233辆' +'</li>');
                        arr.push('</ul>');
                        arr.push('<table id="table">');
                        arr.push('<tr id="th">')
                        arr.push('<th>车流来向</th>\n' +
                            '                         <th>左转（辆）</th>\n' +
                            '                         <th>直行（辆）</th>\n' +
                            '                         <th>右转（辆）</th>');
                        arr.push('</tr>')
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
                },
                error: function (error) {
                    console.log("error:" + error);
                }
            })
        });
    }
    //open
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        bmap.openInfoWindow(infoWindow,point); //开启信息窗口
    }

    // 添加百度地图插件End ====================================

});
/*if (option && typeof option === "object") {
    myChart.setOption(option, true);
}*/
