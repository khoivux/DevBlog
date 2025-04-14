package com.dev_blog.service.impl;

import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.EmailSerivce;
import com.dev_blog.util.VerifyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailSerivce {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;


    @Value("${spring.mail.username}")
    private String fromMail;

    private static final long EXPIRE_MINUTES = 5;

    @Override
    public void sendEmail(String receiver, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromMail);
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Override
    public String sendOTP(String email) {
        if(!userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_NOT_EXISTED);
        }
        String otp = VerifyUtil.generateOTP(6);
        redisTemplate.opsForValue().set(email, otp, Duration.ofMinutes(EXPIRE_MINUTES));
        sendEmail(
                email,
                "Mã OTP xác minh",
                "Mã OTP của bạn là: " + otp + "\nMã có hiệu lực trong 5 phút."
        );
        return "Đã gửi email đến địa chỉ " + email;
    }
}
