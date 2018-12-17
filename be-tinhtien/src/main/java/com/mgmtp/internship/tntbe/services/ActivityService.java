package com.mgmtp.internship.tntbe.services;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    ActivityRepository activityRepository;

    public String generateLink(String activityName) {
        String temp = "";
        try {
            byte[] bytesOfMessage = (activityName + System.currentTimeMillis()).getBytes("UTF-8");
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            byte[] theDigest = md5.digest(bytesOfMessage);
            BigInteger bigInt = new BigInteger(1, theDigest);
            temp = bigInt.toString(16);
        }
        catch (NoSuchAlgorithmException | UnsupportedEncodingException e) { }
        return temp.substring(0, 6);
    }

    public boolean isEmptyOrNull(String string) {
        return string == null || string.trim().equals("");
    }

    public String saveNewActivity(String name){
        if (isEmptyOrNull(name)) {
            return "{\"error\": \"Activity Name is empty\"}";
        } else {
            String url = generateLink(name);
            Activity activity = new Activity();
            activity.setName(name);
            activity.setUrl(url);
            Activity newActivity = activityRepository.save(activity);
            return "{ \"activity-link\": \"" + newActivity.getUrl() + "\"}";
        }
    }

    public String getNameActivityByCode(String code) {
        Activity activity = activityRepository.findByUrl(code);
        if (activity!=null){
            return activity.getName();
        } else return null;
    }

    public List<Activity> getAll() {
        return activityRepository.getAllByOrderByIdDesc();
    }
}