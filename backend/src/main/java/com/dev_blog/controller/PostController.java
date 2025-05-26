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
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/post")
@Tag(name = "Post Controller")
public class PostController {
    private final PostService postService;
    private SecurityUtil securityUtil;

    @Operation(summary = "Get Post List")
    @GetMapping("/")
    public ApiResponse<PageResponse<PostResponse>> getList(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "status", defaultValue = "approved") String status,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        SearchRequest searchRequest = new SearchRequest(query,  categoryId, sortBy, status.toUpperCase());
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .data(postService.getList(searchRequest, page, size))
                .message("Danh sách bài viết")
                .build();
    }


    @Operation(summary = "Create New Post")
    @PostMapping("/create")
    public ApiResponse<PostResponse> handlePost(@Valid @RequestBody PostCreateRequest postRequest) {
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
    @PutMapping("/edit")
    public ApiResponse<PostResponse> editPost(@RequestBody PostRequest postRequest) {
        return ApiResponse.<PostResponse> builder()
                .data(postService.editPost(postRequest))
                .message("Chỉnh sửa bài viết thành công")
                .build();
    }

    @Operation(summary = "Delete Post")
    @DeleteMapping("/delete/{postId}")
    public ApiResponse<Object> deletePost(@PathVariable Long postId) {
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

    @Operation(summary = "Check Post Vote")
    @GetMapping("/vote/{postId}")
    public ApiResponse<Object> checkVote(@PathVariable Long postId) {
        return ApiResponse.builder()
                .data(postService.checkVote(postId))
                .build();
    }
}


