package com.dev_blog.controller;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.VoteType;
import com.dev_blog.service.PostService;
import com.dev_blog.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/v1/post")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private SecurityUtil securityUtil;

    @Operation(summary = "All Post")
    @GetMapping("/all")
    public ApiResponse<?> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.builder()
                .data(postService.getAll(page, size))
                .message("Tạo danh mục thành công")
                .build();
    }


    @Operation(summary = "Add New Post")
    @PostMapping("/add")
    public ApiResponse<?> handlePost(@RequestBody PostCreateRequest postRequest) {
        return ApiResponse.builder()
                .data(postService.createPost(postRequest))
                .message("Đăng bài thành công")
                .build();
    }

    @Operation(summary = "Get Single Post")
    @GetMapping("/{postId}")
    public ApiResponse<?> singlePost(@PathVariable Long postId) {
        postService.increaseView(postId);
        return ApiResponse.builder()
                .data(postService.getSinglePost(postId))
                .build();
    }

    @Operation(summary = "Get User's posts")
    @GetMapping("/user/{userId}")
    public ApiResponse<Object> getMyPosts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @PathVariable Long userId
    ) {
        return ApiResponse.builder()
                .data(postService.getPostsByUser(page, size, userId))
                .build();
    }

    @Operation(summary = "Edit Post")
    @PostMapping("/edit")
    public ApiResponse<?> editPost(@RequestBody PostRequest postRequest) {
        return ApiResponse.builder()
                .data(postService.editPost(postRequest))
                .message("Chỉnh sửa bài viết thành công")
                .build();
    }

    @Operation(summary = "Delete Post")
    @DeleteMapping("/delete")
    public ApiResponse<?> deletePost(@RequestParam Long postId) {
        return ApiResponse.builder()
                .message(postService.deletePost(postId))
                .build();
    }

    @Operation(summary = "Voting Post")
    @PostMapping("/{postId}/{voteType}")
    public ApiResponse<?> votePost(@PathVariable Long postId,
                                   @PathVariable String voteType) {
        return ApiResponse.builder()
                .data(postService.votePost(postId, VoteType.valueOf(voteType.toUpperCase())))
                .build();
    }
}


