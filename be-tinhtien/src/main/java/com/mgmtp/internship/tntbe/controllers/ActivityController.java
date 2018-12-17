package com.mgmtp.internship.tntbe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import com.mgmtp.internship.tntbe.services.ActivityService;

@RestController
@RequestMapping("/api")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    private Map<String, String> activityMap = new HashMap();

    @PostMapping(value = "/activity")
    public String getLinkFromActivityName(@RequestBody net.minidev.json.JSONObject data) {
        String activityName = data.get("activity-name").toString();
        if (activityService.isEmptyOrNull(activityName)) return "{\"error\": \"Activity Name is empty\"}";
        String activityLink = activityService.generateLink(activityName);
        activityMap.put(activityLink, activityName);
        return "{ \"activity-link\": \"" + activityLink + "\"}";
    }

    @GetMapping(value = "/activity/{code}")
    public String getActivityNameFromLink(@PathVariable String code) {
        return "{ \"activity-name\": \"" + activityMap.get(code) + "\"}";
    }
}
