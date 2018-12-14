package com.mgmtp.internship.tntbe.services;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class ActivityService {

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
}