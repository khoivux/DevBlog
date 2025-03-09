package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Web Controller")
public class WebController {
    private final PostService postService;

    @Operation(summary = "Search")
    @GetMapping("/search")
    public ApiResponse<?> search(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.builder()
                .data(postService.searchPost(query, categoryId, sortBy, page, size))
                .build();
    }
}
