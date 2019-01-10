package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    ActivityRepository activityRepository;

    private String generateLink(String activityName) {
        String link = "";
        try {
            byte[] bytesOfMessage = (activityName + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8);
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            byte[] theDigest = md5.digest(bytesOfMessage);
            BigInteger bigInt = new BigInteger(1, theDigest);
            link = bigInt.toString(16);
        } catch (NoSuchAlgorithmException e) {
            System.out.println(e.getMessage());
        }
        return link.substring(0, 6);
    }

    public Object saveNewActivity(String name) {
        if (name == null || name.isEmpty()) {
            return new ErrorMessage("Activity Name is empty");
        } else {
            String url = generateLink(name);
            Activity activity = new Activity(name, url);
            activity = activityRepository.save(activity);
            if (activity == null) {
                return new ErrorMessage("Save activity failure");
            } else {
                return new ActivityDTO(name, activity.getUrl());
            }
        }
    }

    public ActivityDTO getActivity(String url) {
        Activity activity = activityRepository.findByUrl(url);
        if (activity != null) {
            return new ActivityDTO(activity.getName(), activity.getUrl());
        } else return null;
    }

    public List<Activity> getAll() {
        return activityRepository.getAllByOrderByIdDesc();
    }
}