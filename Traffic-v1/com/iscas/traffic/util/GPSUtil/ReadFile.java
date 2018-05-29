package com.iscas.traffic.util.GPSUtil;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.iscas.traffic.entity.CoordEntity;
import com.iscas.traffic.util.PathUtil;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import sun.nio.ch.IOUtil;

import java.io.*;
import java.util.*;

public class ReadFile {
    /**
     * 读取excel文件
     *
     * @param fileName 文件路径
     * @return 返回数组
     * @throws IOException
     */
    public ArrayList<CoordEntity> readExcel(String fileName) throws IOException {
        String path = PathUtil.Resouce_PATH + fileName;
        File file = new File(path);
        InputStream in = new FileInputStream(file);
        //得到整个excel对象
        HSSFWorkbook excel = new HSSFWorkbook(in);
        //获取整个excel有多少个sheet
        int sheets = excel.getNumberOfSheets();
        //便利第一个sheet
        HSSFSheet sheet = excel.getSheet("SQL Results");
        int numberOfSheets = excel.getNumberOfSheets();
        int lastRowNum = sheet.getLastRowNum();
        ArrayList<CoordEntity> GPSJson = new ArrayList<>();
        for (int i = 1; i < lastRowNum; i++) {//遍历每一行
            HSSFRow row = sheet.getRow(i);
            short lastCellNum = row.getLastCellNum();
            HSSFCell pointcode = row.getCell(1);
            if (pointcode.getStringCellValue().length() == 12) {//将行中的值存入对象，注意选择条件
                HSSFCell pointname = row.getCell(2);
                HSSFCell longitude = row.getCell(3);
                HSSFCell latitude = row.getCell(4);
                CoordEntity coordEntity = new CoordEntity(
                        pointcode.getStringCellValue(),
                        pointname.getStringCellValue(),
                        longitude.getStringCellValue(),
                        latitude.getStringCellValue());
                GPSJson.add(coordEntity);
            }
        }
        return GPSJson;
    }

    /**
     * 读取Properties文件
     * @param fileName 文件路径
     * @return 返回set
     * @throws IOException
     */
    public Set<String> readProperties(String fileName) throws IOException {
        Properties properties = new Properties();
        File file = new File(fileName);
        properties.load(new FileInputStream(file));
        Set<Object> objects = properties.keySet();
        Set<String> set = new HashSet<String>();
        for (Object s : objects) {
            String temp = (String) s;
            String[] split = temp.split("-");
            set.add(split[0]);
        }
        return set;
    }

    public List<CoordEntity> readJSON(String fileName) throws IOException {
        String coorJson = fileToString(fileName);
        List<CoordEntity> coordEntities = JSONArray.parseArray(coorJson, CoordEntity.class);
        return coordEntities;
    }

    public String fileToString(String fileName) throws IOException {
        File file = new File(fileName);
        FileReader fr = new FileReader(file);
        StringBuilder sb = new StringBuilder();
        char[] bf = new char[1024];
        int b;
        while((b=fr.read(bf))!=-1){
            sb.append(new String(bf,0,b));
        }
        fr.close();
        return sb.toString();
    }
}
