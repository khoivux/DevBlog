package com.dev_blog.service.impl;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.entity.ReportCommentEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Status;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.CommentRepository;
import com.dev_blog.repository.ReportCommentRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.ReportCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportCommentServiceImpl implements ReportCommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReportCommentRepository reportCommentRepository;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public String deleteReport(Long reportId) {
        ReportCommentEntity report = reportCommentRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));

        reportCommentRepository.delete(report);
        return "Đã xóa báo cáo";
    }


    @Override
    public ReportCommentDTO createReport(ReportCommentDTO request) {
        ReportCommentEntity reportComment = ReportCommentEntity.builder()
                .comment(commentRepository.getReferenceById(request.getCommentId()))
                .author(userRepository.getReferenceById(request.getAuthorId()))
                .reason(request.getReason())
                .build();

        reportCommentRepository.save(reportComment);
        return null;
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public String handleReport(Long reportId, Status status) {
        ReportCommentEntity report = reportCommentRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));

        report.setStatus(status);
        reportCommentRepository.save(report);

        if(status == Status.APPROVED)
            return "Đã xử lý báo cáo";
        return "Đã từ chối báo cáo";
    }
}
