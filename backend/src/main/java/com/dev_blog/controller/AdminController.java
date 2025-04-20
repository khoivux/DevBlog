package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.Status;
import com.dev_blog.service.PostService;
import com.dev_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Controller")
public class AdminController {
    private final PostService postService;
    private final UserService userService;

    @Operation(summary = "Approve Post")
    @PatchMapping("/approve/{postId}")
    public ApiResponse<Object> approvePost(@PathVariable Long postId) {
        return ApiResponse.builder()
                .message(postService.handlePost(postId, Status.APPROVED))
                .data(postService.getSinglePost(postId))
                .build();
    }

    @Operation(summary = "Reject Post")
    @PatchMapping("/reject/{postId}")
    public ApiResponse<Object> rejectPost(@PathVariable Long postId) {
        return ApiResponse.builder()
                .message(postService.handlePost(postId, Status.REJECTED))
                .build();
    }

    @Operation(summary = "Block User")
    @PatchMapping("/block")
    public ApiResponse<Object> blockOrEnable(
            @RequestParam String username,
            @RequestParam Boolean block)
    {
        return ApiResponse.builder()
                .message(userService.blockOrActive(username, block))
                .build();
    }

    @Operation(summary = "Set Mod")
    @PatchMapping("/set-roles")
    public ApiResponse<Object> setRoles(
            @RequestParam String username,
            @RequestParam String role)
    {
        return ApiResponse.builder()
                .message(userService.setRole(username, role))
                .build();
    }
}
