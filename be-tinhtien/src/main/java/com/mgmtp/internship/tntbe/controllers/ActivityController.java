package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.services.ActivityService;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping(value = "")
    public Object saveNewActivity(@RequestBody ActivityDTO activityDTO) {
        String activityName = activityDTO.getName();
        return activityService.saveNewActivity(activityName);
    }

    @GetMapping(value = "/{url}")
    public Object getActivity(@PathVariable String url) {
        if (activityService.getActivity(url) == null){
            return new ErrorMessage("Activity doesn't exist!");
        }
        return activityService.getActivity(url);
    }

    @GetMapping(value = "/")
    public List<Activity> getAll() {
        return activityService.getAll();
    }
}
