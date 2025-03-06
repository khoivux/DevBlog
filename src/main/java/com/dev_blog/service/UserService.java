package com.dev_blog.service;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;

public interface UserService {
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse findByUsername(String username);
    PageResponse<UserResponse> findAll(int page, int size);
    UserResponse getCurrUser();
    PageResponse<UserResponse> searchUser(String query, String sortBy, int page, int size);
}
