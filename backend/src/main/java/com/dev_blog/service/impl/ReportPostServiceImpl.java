package com.dev_blog.service.impl;

import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.response.ReportPostResponse;
import com.dev_blog.entity.ReportPostEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Status;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.ReportPostMapper;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.ReportPostRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.ReportPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportPostServiceImpl implements ReportPostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ReportPostRepository reportPostRepository;
    private final ReportPostMapper reportPostMapper;

    @Override
    public ReportPostResponse createReport(ReportPostRequest request) {
        ReportPostEntity reportPostEntity = ReportPostEntity.builder()
                .post(postRepository.getReferenceById(request.getPostId()))
                .author(userRepository.getReferenceById(request.getUserId()))
                .reason(request.getReason())
                .build();
        reportPostRepository.save(reportPostEntity);
        return reportPostMapper.toResponse(reportPostEntity);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public String handelReport(Long reportId, Status status) {
        ReportPostEntity report = reportPostRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));
        report.setStatus(status);
        if(status == Status.APPROVED)
            return "Đã xử lý báo cáo";
        return "Đã từ chối báo cáo";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteReport(Long reportId) {
        ReportPostEntity report = reportPostRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));
        reportPostRepository.delete(report);
        return "Đã xóa báo cáo";
    }
}
