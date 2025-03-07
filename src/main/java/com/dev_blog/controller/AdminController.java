package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.Status;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Controller")
public class AdminController {
    private final PostService postService;

    @PutMapping("/approve/{postId}")
    public ApiResponse<?> approvePost(@PathVariable Long postId) {
        return ApiResponse.builder()
                .message(postService.handlePost(postId, Status.APPROVED))
                .build();
    }

    @PutMapping("/reject/{postId}")
    public ApiResponse<?> rejectPost(@PathVariable Long postId) {
        return ApiResponse.builder()
                .message(postService.handlePost(postId, Status.REJECTED))
                .build();
    }
}
