package com.dev_blog.controller;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.Status;
import com.dev_blog.service.ReportCommentService;
import com.dev_blog.service.ReportPostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/report")
@Tag(name = "Report Controller")
public class ReportController {
    private final ReportPostService reportPostService;
    private final ReportCommentService reportCommentService;

    @GetMapping("/post/list")
    public ApiResponse<?> getReportPostList(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", defaultValue = "newest") String sortBy,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        SearchRequest request = new SearchRequest(query,  categoryId, sortBy);
        return ApiResponse.builder()
                .data(reportPostService.getList(request, page, size))
                .build();
    }

    @PostMapping("/post/create")
    public ApiResponse<?> createReportPost(@RequestBody ReportPostRequest request) {
        return ApiResponse.builder()
                .data(reportPostService.createReport(request))
                .build();
    }

    @PutMapping("/post/{reportId}")
    public ApiResponse<?> handleReportPost(@PathVariable Long reportId,
                                           @RequestParam String status) {
        return ApiResponse.builder()
                .message(reportPostService.handelReport(reportId, Status.valueOf(status.toUpperCase())))
                .build();
    }


    @PostMapping("/comment/create")
    public ApiResponse<?> createReportComment(@RequestBody ReportCommentDTO request) {
        return ApiResponse.builder()
                .data(reportCommentService.createReport(request))
                .build();
    }

    @PutMapping("/comment/{reportId}")
    public ApiResponse<?> handleReportComment(@PathVariable Long reportId,
                                              @RequestParam String status) {
        return ApiResponse.builder()
                .message(reportCommentService.handleReport(reportId, Status.valueOf(status.toUpperCase())))
                .build();
    }

}
