package com.dev_blog.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class VerifyUtil {
    public static String generateOTP(Integer length) {
        String characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstwzx0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(characters.charAt(random.nextInt(characters.length())));
        }
        return otp.toString();
    }
}
