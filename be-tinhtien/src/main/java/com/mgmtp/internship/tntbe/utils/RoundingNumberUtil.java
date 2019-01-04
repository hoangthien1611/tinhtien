package com.mgmtp.internship.tntbe.utils;

public class RoundingNumberUtil {
    public static double roundOffToDecPlaces(double number, int lengthOfFacialPart) {
        return Math.round(number * Math.pow(10, lengthOfFacialPart)) / Math.pow(10, lengthOfFacialPart) * 1.0;
    }
}
