package com.dev_blog.service;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;

public interface UserService {
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse findByUsername(String username);
    UserResponse findByEmail(String email);
    PageResponse<UserResponse> getList(String query, String sortBy, int page, int size);
    String changePassword(String oldPassword, String newPassword);
    String setRole(String username, String role);
    String blockOrActive(String username, Boolean blocked);
}
