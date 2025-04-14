package com.dev_blog.controller;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.FollowService;
import com.dev_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final FollowService followService;

    @Operation(summary = "Get User List")
    @GetMapping("/list")
    public ApiResponse<?> getUserList(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", required = false) String sortBy
    ) {
        return ApiResponse.builder()
                .data(userService.getList(query, sortBy, page, size))
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
    @PostMapping("/edit")
    public ApiResponse<?> updateProfile(@RequestBody UserUpdateRequest request) {
        return ApiResponse.builder()
                .data(userService.updateProfile(request))
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
    @PutMapping("/change-password")
    public ApiResponse<?> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String  newPassword) {
        return ApiResponse.builder()
                .message(userService.changePassword(oldPassword, newPassword))
                .build();
    }
}
