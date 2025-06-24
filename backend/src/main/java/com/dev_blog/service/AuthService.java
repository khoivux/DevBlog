package com.dev_blog.service;

import com.dev_blog.dto.request.AuthRequest;
import com.dev_blog.dto.request.LogoutRequest;
import com.dev_blog.dto.request.RegisterRequest;
import com.dev_blog.dto.response.AuthResponse;
import com.dev_blog.dto.response.UserResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthService {
    AuthResponse refresh(String refreshToken);
    UserResponse register(RegisterRequest registerRequest);
    boolean verifyEmail(String email, String otp);
    String resetPassword(String email, String newPassword, String confirmPassword);
    AuthResponse authenticated(AuthRequest requestDTO);
    String logout(LogoutRequest request) throws JOSEException, ParseException;
}
