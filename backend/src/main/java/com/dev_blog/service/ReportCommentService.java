package com.dev_blog.service;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.enums.Status;

public interface ReportCommentService {
    ReportCommentDTO createReport(ReportCommentDTO request);
    String handleReport(Long reportId, Status status);
    String deleteReport(Long reportId);
}
