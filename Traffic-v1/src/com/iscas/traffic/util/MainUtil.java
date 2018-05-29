package com.iscas.traffic.util;

import com.iscas.traffic.entity.CoordEntity;
import com.iscas.traffic.util.GPSUtil.DataSaveInFile;
import com.iscas.traffic.util.GPSUtil.GPSFactory;
import com.iscas.traffic.util.GPSUtil.ReadExcel;

import java.io.IOException;
import java.util.ArrayList;

public class MainUtil {
    public static void main(String[] args) {
        try {
            GPSUtil("GPS信息.xls","GPS_baidu.txt");
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            System.out.println("转换结束.");
        }
    }

    public static void GPSUtil(String excelName,String GPSTxtName) throws IOException {
        System.out.println("开始转换...");
        ReadExcel readExcel = new ReadExcel();
        DataSaveInFile dataSaveInFile = new DataSaveInFile();
        GPSFactory gpsFactory = new GPSFactory();
        ArrayList<CoordEntity> coordEntities = readExcel.start(excelName);
        ArrayList<CoordEntity> baiduGPSAboutBase64s = gpsFactory.WGS84ToBaiduGPS(coordEntities);
        dataSaveInFile.start(baiduGPSAboutBase64s,GPSTxtName);
    }
}
