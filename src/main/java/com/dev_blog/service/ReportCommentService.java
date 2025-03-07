package com.dev_blog.service;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.enums.Status;
import org.springframework.security.access.prepost.PreAuthorize;

public interface ReportCommentService {
    ReportCommentDTO createReport(ReportCommentDTO request);

    @PreAuthorize("hasRole('ADMIN')")
    String handleReport(Long reportId, Status status);

    @PreAuthorize("hasRole('ADMIN')")
    String deleteReport(Long reportId);
}
