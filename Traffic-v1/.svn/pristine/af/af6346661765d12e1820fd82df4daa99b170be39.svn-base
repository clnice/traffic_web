package com.iscas.traffic.util.GPSUtil;

import com.alibaba.fastjson.JSON;
import com.iscas.traffic.entity.CoordEntity;
import com.iscas.traffic.util.PathUtil;

import java.io.*;
import java.util.ArrayList;

public class DataSaveInFile{
    public void start(ArrayList<CoordEntity> coordEntities,String fileName) throws IOException {
        String path = PathUtil.Resouce_PATH+fileName;
        File file = new File(path);
        // 将文件读入输入流
        FileOutputStream fos = new FileOutputStream(file);
        PrintWriter printWriter = new PrintWriter(fos);
        BufferedWriter bw = new BufferedWriter(printWriter);
        for (CoordEntity c : coordEntities) {
            String line = JSON.toJSONString(c);
            bw.write(line);
            bw.flush();
            bw.newLine();
        }
        //bw.newLine();
        fos.close();
        printWriter.close();
        bw.close();
    }
}
