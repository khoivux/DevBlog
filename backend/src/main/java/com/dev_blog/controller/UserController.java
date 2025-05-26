package com.dev_blog.controller;


import com.dev_blog.dto.request.ChangePasswordRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.FollowService;
import com.dev_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@Tag(name = "User Controller")
public class UserController {
    private final UserService userService;
    private final FollowService followService;

    @Operation(summary = "Get User List")
    @GetMapping("/")
    public ApiResponse<?> getUserList(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "startDate", required = false) Instant startDate,
              @RequestParam(value = "endDate", required = false) Instant endDate
    ) {
        SearchRequest searchRequest = new SearchRequest(query, sortBy, startDate, endDate);
        return ApiResponse.builder()
                .data(userService.getList(searchRequest, page, size))
                .build();
    }

    @Operation(summary = "Get User")
    @GetMapping("/{username}")
    public ApiResponse<?> getProfile(@PathVariable("username") String username) {
        return ApiResponse.builder()
                .data(userService.findByUsername(username))
                .build();
    }

    @Operation(summary = "Get User by Email")
    @GetMapping("/email/{email}")
    public ApiResponse<?> getByEmail(@PathVariable("email") String username) {
        return ApiResponse.builder()
                .data(userService.findByUsername(username))
                .build();
    }

    @Operation(summary = "Edit User")
    @PutMapping("/edit")
    public ApiResponse<?> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.builder()
                .data(userService.updateProfile(request))
                .message("Chỉnh sửa hồ sơ thành công")
                .build();
    }

    @Operation(summary = "Follow User")
    @PostMapping("/follow/{followedId}")
    public ApiResponse<?> followUser(@PathVariable Long followedId) {
        return ApiResponse.builder()
                .message(followService.followUser(followedId))
                .build();
    }

    @Operation(summary = "Unfollow User")
    @PostMapping("/unfollow/{followedId}")
    public ApiResponse<?> unfollowUser(@PathVariable Long followedId) {
        return ApiResponse.builder()
                .message(followService.unfollowUser(followedId))
                .build();
    }

    @Operation(summary = "Get Followers")
    @GetMapping("/{username}/followers")
    public ApiResponse<?> getFollowers(
            @PathVariable String username,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.builder()
                .data(followService.getFollowers(page, size, username))
                .build();
    }

    @Operation(summary = "Get Following")
    @GetMapping("/{username}/following")
    public ApiResponse<?> getFollowing(
            @PathVariable String username,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.builder()
                .data(followService.getFollowing(page, size, username))
                .build();
    }

    @Operation(summary = "Change Password")
    @PatchMapping("/change-password")
    public ApiResponse<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ApiResponse.builder()
                .message(userService.changePassword(request))
                .build();
    }
}
