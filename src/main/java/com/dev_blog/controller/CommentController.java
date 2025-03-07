package com.dev_blog.controller;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/comment")
@Tag(name = "Comment Controller")
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/{postId}")
    public ApiResponse<?> getCommentsByPost(@PathVariable Long postId) {
        return ApiResponse.builder()
                .data(commentService.getCommentsByPost(postId))
                .message("Bình luận thành công")
                .build();
    }

    @PostMapping("/")
    public ApiResponse<?> createComment(@Valid @RequestBody CommentDTO request) {
        return ApiResponse.builder()
                .data(commentService.createComment(request))
                .message("Bình luận thành công")
                .build();
    }

    @PutMapping("/")
    public ApiResponse<?> editComment(@Valid @RequestBody CommentDTO request) {
        return ApiResponse.builder()
                .data(commentService.editComment(request))
                .message("Chỉnh sửa bình luận thành công")
                .build();
    }
}
