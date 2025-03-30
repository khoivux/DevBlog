package com.dev_blog.controller;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Get Post's Comment")
    @GetMapping("/{postId}")
    public ApiResponse<PageResponse<CommentDTO>> getCommentsByPost(
            @PathVariable Long postId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.<PageResponse<CommentDTO>>builder()
                .data(commentService.getCommentsByPost(page, size, postId))
                .build();
    }

    @Operation(summary = "Create Comment")
    @PostMapping("/")
    public ApiResponse<CommentDTO> createComment(@Valid @RequestBody CommentDTO request) {
        return ApiResponse.<CommentDTO> builder()
                .data(commentService.createComment(request))
                .message("Bình luận thành công")
                .build();
    }

    @Operation(summary = "Edit Comment")
    @PutMapping("/")
    public ApiResponse<CommentDTO> editComment(@Valid @RequestBody CommentDTO request) {
        return ApiResponse.<CommentDTO> builder()
                .data(commentService.editComment(request))
                .message("Chỉnh sửa bình luận thành công")
                .build();
    }

    @Operation(summary = "Delete Comment")
    @DeleteMapping("/")
    public ApiResponse<Object> deleteComment(@RequestParam Long commentId) {
        return ApiResponse.builder()
                .message(commentService.deleteComment(commentId))
                .build();
    }
}
