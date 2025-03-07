package com.dev_blog.service;

import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.response.ReportPostResponse;
import com.dev_blog.enums.Status;

public interface ReportPostService {
    ReportPostResponse createReport(ReportPostRequest request);

    String handelReport(Long reportId, Status status);

    String deleteReport(Long reportId);
}
