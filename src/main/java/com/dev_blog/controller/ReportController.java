package com.dev_blog.controller;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.dto.request.ReportPostRequest;
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

    @PostMapping("/post/create")
    public ApiResponse<?> createReportPost(@RequestBody ReportPostRequest request) {
        return ApiResponse.builder()
                .data(reportPostService.createReport(request))
                .build();
    }

    @PutMapping("/post/{reportId}")
    public ApiResponse<?> handleReportPost(@PathVariable Long reportId,
                                       String status) {
        return ApiResponse.builder()
                .message(reportPostService.handelReport(reportId, Status.valueOf(status)))
                .build();
    }

    @DeleteMapping("/post/{reportId}")
    public ApiResponse<?> deleteReportPost(@PathVariable Long reportId) {
        return ApiResponse.builder()
                .message(reportPostService.deleteReport(reportId))
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
                                           String status) {
        return ApiResponse.builder()
                .message(reportCommentService.handleReport(reportId, Status.valueOf(status)))
                .build();
    }

    @DeleteMapping("/comment/{reportId}")
    public ApiResponse<?> deleteReportComment(@PathVariable Long reportId) {
        return ApiResponse.builder()
                .message(reportCommentService.deleteReport(reportId))
                .build();
    }
}
