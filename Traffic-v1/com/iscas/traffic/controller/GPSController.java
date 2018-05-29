package com.iscas.traffic.controller;

import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/GPS")

public class GPSController {
    @RequestMapping(value = "/test")
    @ResponseBody
    public String test(String name){
        return JSON.toJSONString("成功接收:"+name);
    }
}
