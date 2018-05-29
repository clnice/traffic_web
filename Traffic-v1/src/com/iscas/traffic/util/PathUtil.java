package com.iscas.traffic.util;

import java.io.File;

public class PathUtil {
    public static String separator = File.separator;
    public static String ABSOLUTE_PATH =new File("").getAbsolutePath();//获取绝对路径
    public static String Resouce_PATH = ABSOLUTE_PATH +separator+"resouce"+separator;//资源路径

}
