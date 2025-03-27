package com.dev_blog.service;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {
    UserResponse updateProfile(UserUpdateRequest request);
    UserResponse findByUsername(String username);
    PageResponse<UserResponse> getList(String query, String sortBy, int page, int size);
    String changePassword(String oldPassword, String newPassword);
    @PreAuthorize("hasRole('ADMIN')")
    String setRole(String username, String role);
    @PreAuthorize("hasRole('ADMIN')")
    String blockOrActive(String username, Boolean blocked);
}
