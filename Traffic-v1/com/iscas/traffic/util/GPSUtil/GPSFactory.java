package com.iscas.traffic.util.GPSUtil;

import com.alibaba.fastjson.JSON;
import com.iscas.traffic.entity.BaiduGPSAboutBase64;
import com.iscas.traffic.entity.CoordEntity;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

public class GPSFactory {
    /**
     * 坐标转换
     * @param WGS84 google地球坐标
     * @return 百度坐标
     * @throws IOException
     */
    public ArrayList<CoordEntity> WGS84ToBaiduGPS(ArrayList<CoordEntity> WGS84) throws IOException {

        ArrayList<BaiduGPSAboutBase64> baiduGPSAboutBase64s = new ArrayList<>();//存储转化后坐标

        for (CoordEntity coordEntity : WGS84) {//转化所有坐标
            //WGS84的x和y坐标
            String x = coordEntity.getLng();
            String y = coordEntity.getLat();
            String apiUrl = "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x="+x+"&y="+y+"&qq-pf-to=pcqq.c2c";

            String result = ApiConnect(apiUrl, "GET");//开始连接，返回结果（json）
            //System.out.println("得到的数据:"+result);

            BaiduGPSAboutBase64 baiduGPSAboutBase64 = JSON.parseObject(result.toString(),BaiduGPSAboutBase64.class);//JSON解析
            //base64解码 得到百度
            final Base64.Decoder decoder =  Base64.getDecoder();
            x = new String(decoder.decode(baiduGPSAboutBase64.getX()), "UTF-8");
            y = new String(decoder.decode(baiduGPSAboutBase64.getY()), "UTF-8");
            coordEntity.setLng(x);
            coordEntity.setLat(y);
        }
        return WGS84;
    }

    /**
     * 连接api接口
     * @param apiUrl api地址
     * @param method 请求方法
     * @return
     * @throws IOException
     */
    public String ApiConnect(String apiUrl,String method) throws IOException {
        //System.out.println("========开始连接:"+apiUrl+"===========");
        //开始连接api
        URL url = new URL(apiUrl);
        HttpURLConnection httpURLConnection = (HttpURLConnection)url.openConnection();
        httpURLConnection.setDoOutput(true);
        httpURLConnection.setDoInput(true);
        httpURLConnection.setUseCaches(false);
        //请求方式
        httpURLConnection.setRequestMethod(method);
        httpURLConnection.connect();
        //将返回数据写入io
        InputStream inputStream = httpURLConnection.getInputStream();
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
        StringBuffer result = new StringBuffer();//用来存储返回的结果
        String str = null;
        while((str = bufferedReader.readLine())!=null){
            result.append(str);
        }
        //关闭资源
        bufferedReader.close();
        inputStreamReader.close();
        inputStream.close();
        httpURLConnection.disconnect();
        return result.toString();
    }

    public ArrayList<CoordEntity> chooseRoad(List<CoordEntity> oldRoad,Set<String> newRoad){
        ArrayList<CoordEntity> coordEntities = new ArrayList<>();
        int i = 0;
        for (String s : newRoad) {
            for (CoordEntity c : oldRoad) {
                if(s.equals(c.getRoadId())){
                    i++;
                    coordEntities.add(c);
                }
            }
        }
        System.out.println(i);
        return coordEntities;
    }

}
