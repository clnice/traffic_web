package com.iscas.traffic.util.GPSUtil;

import com.iscas.traffic.entity.CoordEntity;
import com.iscas.traffic.util.PathUtil;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class ReadExcel {

    public ArrayList<CoordEntity> start(String fileName) throws IOException {
        String path = PathUtil.Resouce_PATH+fileName;
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
            if(pointcode.getStringCellValue().length()==12){//将行中的值存入对象，注意选择条件
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
}
