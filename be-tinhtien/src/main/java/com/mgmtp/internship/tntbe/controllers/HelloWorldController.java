package com.mgmtp.internship.tntbe.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hello")
public class HelloWorldController {

    private Integer beginNumber = 0;

    @GetMapping("/get-increasing-number")
    public Integer getIncreasingNumber() {
        return ++beginNumber;
    }
}
