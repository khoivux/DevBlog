package com.dev_blog.controller;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.enums.VoteType;
import com.dev_blog.service.PostService;
import com.dev_blog.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/post")
public class PostController {
    private final PostService postService;
    private SecurityUtil securityUtil;

    @Operation(summary = "All Post")
    @GetMapping("/list")
    public ApiResponse<PageResponse<PostResponse>> getList(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "status", defaultValue = "APPROVED") String status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        SearchRequest searchRequest = new SearchRequest(query,  categoryId, sortBy, status.toLowerCase());
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .data(postService.getList(searchRequest, page, size))
                .message("Danh sách bài viết")
                .build();
    }


    @Operation(summary = "Add New Post")
    @PostMapping("/add")
    public ApiResponse<PostResponse> handlePost(@RequestBody PostCreateRequest postRequest) {
        return ApiResponse.<PostResponse>builder()
                .data(postService.createPost(postRequest))
                .message("Đăng bài thành công")
                .build();
    }

    @Operation(summary = "Get Single Post")
    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> singlePost(@PathVariable Long postId) {
        postService.increaseView(postId);
        return ApiResponse.<PostResponse>builder()
                .data(postService.getSinglePost(postId))
                .build();
    }

    @Operation(summary = "Get User's posts")
    @GetMapping("/user/{userId}")
    public ApiResponse<Object> getPostsByUserId(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @PathVariable Long userId
    ) {
        return ApiResponse.builder()
                .data(postService.getPostsByUser(page, size, sortBy, userId))
                .build();
    }

    @Operation(summary = "Edit Post")
    @PostMapping("/edit")
    public ApiResponse<PostResponse> editPost(@RequestBody PostRequest postRequest) {
        return ApiResponse.<PostResponse> builder()
                .data(postService.editPost(postRequest))
                .message("Chỉnh sửa bài viết thành công")
                .build();
    }

    @Operation(summary = "Delete Post")
    @DeleteMapping("/delete")
    public ApiResponse<Object> deletePost(@RequestParam Long postId) {
        return ApiResponse.builder()
                .message(postService.deletePost(postId))
                .build();
    }

    @Operation(summary = "Voting Post")
    @PostMapping("/{postId}/{voteType}")
    public ApiResponse<Object> votePost(@PathVariable Long postId,
                                   @PathVariable String voteType) {
        return ApiResponse.builder()
                .data(postService.votePost(postId, VoteType.valueOf(voteType.toUpperCase())))
                .build();
    }
}


