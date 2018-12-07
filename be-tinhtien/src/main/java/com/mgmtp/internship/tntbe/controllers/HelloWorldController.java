package com.mgmtp.internship.tntbe.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

    private Integer beginNumber = 0;

    @CrossOrigin
    @GetMapping("/get-increasing-number")
    public Integer getIncreasingNumber() {
        return ++beginNumber;
    }
}
