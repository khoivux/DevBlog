package com.dev_blog.service.impl;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.ReportCommentEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Status;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.ReportCommentMapper;
import com.dev_blog.repository.CommentRepository;
import com.dev_blog.repository.ReportCommentRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.ReportCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportCommentServiceImpl implements ReportCommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReportCommentRepository reportCommentRepository;
    private final ReportCommentMapper reportCommentMapper;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public String deleteReport(Long reportId) {
        ReportCommentEntity report = reportCommentRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));

        reportCommentRepository.delete(report);
        return "Đã xóa báo cáo";
    }

    @Override
    public PageResponse<ReportCommentDTO> getList(String sortBy, int page, int size) {
        Map<String, Sort> sortOptions = Map.of(
                "latest", Sort.by("createdTime").descending(),
                "oldest", Sort.by("createdTime").ascending()
        );
        Sort sort = sortOptions.getOrDefault(sortBy, Sort.by("createdTime").ascending());

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<ReportCommentEntity> pageData = reportCommentRepository.findAll(pageable);

        List<ReportCommentDTO> list = reportCommentMapper.toResponseList(
                pageData.getContent().stream()
                        .filter(report -> report.getStatus() == Status.PENDING)
                        .collect(Collectors.toList())
        );

        return PageResponse.<ReportCommentDTO>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(list)
                .build();
    }

    @Override
    public ReportCommentDTO createReport(ReportCommentDTO request) {
        ReportCommentEntity reportComment = ReportCommentEntity.builder()
                .comment(commentRepository.getReferenceById(request.getCommentId()))
                .author(userRepository.getReferenceById(request.getAuthorId()))
                .status(Status.PENDING)
                .createdTime(Instant.now())
                .reason(request.getReason())
                .build();

        reportCommentRepository.save(reportComment);
        return reportCommentMapper.toResponse(reportComment);
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
