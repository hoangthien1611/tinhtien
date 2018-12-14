package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.entities.Activity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mgmtp.internship.tntbe.services.ActivityService;

@RestController
@RequestMapping("/api")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping(value = "/activity")
    public String saveNewActivity( @RequestBody net.minidev.json.JSONObject data ){
        String activityName = data.get("activity-name").toString();
        return  activityService.saveNewActivity(activityName);
    }

    @GetMapping(value = "/activity/{code}")
    public String getActivityNameFromLink(@PathVariable String code) {
        String nameActivity = activityService.getNameActivityByCode(code);
        if (nameActivity == null ){
            return "{\"error\": \"Activity doesn't exist!\"}";
        } else {
            return "{ \"activity-name\": \"" + activityService.getNameActivityByCode(code) + "\"}";
        }
    }
}
