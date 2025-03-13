package com.dev_blog.controller;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.FollowService;
import com.dev_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
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

    @Operation(summary = "Get All User")
    @GetMapping("/list")
    public ApiResponse<?> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.builder()
                .data(userService.findAll(page, size))
                .build();
    }

    @Operation(summary = "Get Curr User")
    @GetMapping("/curr")
    public ApiResponse<?> getMyProfile() {
        return ApiResponse.builder()
                .data(userService.getCurrUser())
                .build();
    }

    @Operation(summary = "Get User")
    @GetMapping("/{username}")
    public ApiResponse<?> getProfile(@PathVariable("username") String username) {
        return ApiResponse.builder()
                .data(userService.findByUsername(username))
                .build();
    }

    @Operation(summary = "Edit User")
    @PostMapping("/edit")
    public ApiResponse<?> updateProfile(@Valid @ModelAttribute("userUpdate") UserUpdateRequest request) {
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
    @GetMapping("/{userId}/count-follow")
    public ApiResponse<?> countFollow(@PathVariable Long userId) {
        return ApiResponse.builder()
                .data(followService.getFollowCount(userId))
                .build();
    }

    @Operation(summary = "Get Followers")
    @GetMapping("/{userId}/followers")
    public ApiResponse<?> getFollowers(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.builder()
                .data(followService.getFollowers(page, size, userId))
                .build();
    }

    @Operation(summary = "Get Following")
    @GetMapping("/{userId}/following")
    public ApiResponse<?> getFollowing(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return ApiResponse.builder()
                .data(followService.getFollowing(page, size, userId))
                .build();
    }
}
