package com.dev_blog.service;

import com.dev_blog.model.UserEntity;

public interface JwtService {
    String extractUserId(String token);
    String generateAccessToken(UserEntity user);
    boolean verifyToken(String token);
    String generateRefreshToken(UserEntity user);
}
