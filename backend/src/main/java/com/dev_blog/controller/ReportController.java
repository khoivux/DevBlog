package com.dev_blog.controller;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.Status;
import com.dev_blog.service.ReportCommentService;
import com.dev_blog.service.ReportPostService;
import io.swagger.v3.oas.annotations.Operation;
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


    @Operation(summary = "Get Report Post")
    @GetMapping("/post/list")
    public ApiResponse<?> getReportPostList(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "sortBy", defaultValue = "latest") String sortBy,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
            SearchRequest request = new SearchRequest(query,  categoryId, sortBy);
        return ApiResponse.builder()
                .data(reportPostService.getList(request, page, size))
                .build();
    }

    @Operation(summary = "Create Report Post")
    @PostMapping("/post/create")
    public ApiResponse<?> createReportPost(@RequestBody ReportPostRequest request) {
        return ApiResponse.builder()
                .data(reportPostService.createReport(request))
                .message("Báo cáo thành công!")
                .build();
    }

    @Operation(summary = "Handle Report Post")
    @PatchMapping("/post/{reportId}")
    public ApiResponse<?> handleReportPost(@PathVariable Long reportId,
                                           @RequestParam String status) {
        return ApiResponse.builder()
                .message(reportPostService.handleReport(reportId, Status.valueOf(status.toUpperCase())))
                .build();
    }

    @Operation(summary = "Get Report Comment")
    @GetMapping("/comment/list")
    public ApiResponse<?> getReportCommentList(
            @RequestParam(value = "sortBy", defaultValue = "latest") String sortBy,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.builder()
                .data(reportCommentService.getList(sortBy, page, size))
                .build();
    }

    @Operation(summary = "Create Report Comment")
    @PostMapping("/comment/create")
    public ApiResponse<?> createReportComment(@RequestBody ReportCommentDTO request) {
        return ApiResponse.builder()
                .data(reportCommentService.createReport(request))
                .message("Báo cáo thành công")
                .build();
    }

    @Operation(summary = "Handle Report Comment")
    @PatchMapping("/comment/{reportId}")
    public ApiResponse<?> handleReportComment(@PathVariable Long reportId,
                                              @RequestParam String status) {
        return ApiResponse.builder()
                .message(reportCommentService.handleReport(reportId, Status.valueOf(status.toUpperCase())))
                .build();
    }

}
