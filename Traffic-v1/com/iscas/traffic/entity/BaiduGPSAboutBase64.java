package com.iscas.traffic.entity;

public class BaiduGPSAboutBase64 {
    private int  erro;
    private String x;
    private String y;

    public BaiduGPSAboutBase64() {
    }

    public BaiduGPSAboutBase64(int erro, String x, String y) {
        this.erro = erro;
        this.x = x;
        this.y = y;
    }

    public int getErro() {
        return erro;
    }

    public void setErro(int erro) {
        this.erro = erro;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }
}
