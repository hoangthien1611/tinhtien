package com.mgmtp.internship.tntbe.dto;

import lombok.Data;

@Data
public class ActivityDTO {

    private String name;

    private String url;

    public ActivityDTO(String name){
        this.name = name;
    }

    public ActivityDTO(){
    }

    public ActivityDTO(String name, String url) {
        this.name = name;
        this.url = url;
    }
}

