package com.dev_blog.service;

import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.ReportPostResponse;
import com.dev_blog.enums.Status;
import org.springframework.security.access.prepost.PreAuthorize;

public interface ReportPostService {
    ReportPostResponse createReport(ReportPostRequest request);
    PageResponse<ReportPostResponse> getList(SearchRequest request, int page, int size);

    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    String handleReport(Long reportId, Status status);
}
