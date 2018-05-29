package com.iscas.traffic.util;

import com.iscas.traffic.entity.CoordEntity;
import com.iscas.traffic.util.GPSUtil.DataSaveInFile;
import com.iscas.traffic.util.GPSUtil.GPSFactory;
import com.iscas.traffic.util.GPSUtil.ReadFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.iscas.traffic.util.PathUtil.*;

public class MainUtil {
    public static void main(String[] args) {
        ReadFile readFile = new ReadFile();
        GPSFactory gpsFactory = new GPSFactory();
        try {
            List<CoordEntity> coordEntities = readFile.readJSON(Resouce_PATH + separator + "GPS_baidu.txt");
            Set<String> set = readFile.readProperties(Resouce_PATH + separator + "turnToConfig.properties");
            ArrayList<CoordEntity> coordEntities1 = gpsFactory.chooseRoad(coordEntities, set);
            DataSaveInFile dataSaveInFile = new DataSaveInFile();
            dataSaveInFile.start(coordEntities1,"min_GPS.txt");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 转换GPS
     * @param excelName 电子文档路径
     * @param GPSTxtName 生成文档路径
     * @throws IOException
     */
    public static void GPSUtil(String excelName,String GPSTxtName) throws IOException {
        System.out.println("开始转换...");
        ReadFile readFile = new ReadFile();
        DataSaveInFile dataSaveInFile = new DataSaveInFile();
        GPSFactory gpsFactory = new GPSFactory();
        ArrayList<CoordEntity> coordEntities = readFile.readExcel(excelName);
        ArrayList<CoordEntity> baiduGPSAboutBase64s = gpsFactory.WGS84ToBaiduGPS(coordEntities);
        dataSaveInFile.start(baiduGPSAboutBase64s,GPSTxtName);
    }
}
