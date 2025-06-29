package com.dev_blog.service;


import com.dev_blog.dto.request.ChangePasswordRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;

public interface UserService {
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse findByUsername(String username);
    UserResponse getCurrentUser();
    UserResponse findByEmail(String email);
    PageResponse<UserResponse> getList(SearchRequest searchRequest, int page, int size);
    String changePassword(ChangePasswordRequest request);
    String setRole(String username, String role);
    String blockOrActive(String username, Boolean blocked);
}
