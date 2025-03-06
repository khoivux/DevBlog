package com.dev_blog.service;

import com.dev_blog.dto.request.*;
import com.dev_blog.dto.response.AuthResponse;
import com.dev_blog.dto.response.IntrospectResponse;
import com.dev_blog.dto.response.UserResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthService {
    UserResponse register(RegisterRequest registerRequest);
    AuthResponse authenticated(AuthRequest requestDTO);
    IntrospectResponse introspect(IntrospectRequest requestDTO) throws JOSEException, ParseException;
    AuthResponse refreshToken(RefreshRequest request) throws JOSEException, ParseException;
    String logout(LogoutRequest request) throws JOSEException, ParseException;
}
