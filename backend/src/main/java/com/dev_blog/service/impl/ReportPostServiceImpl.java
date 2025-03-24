package com.dev_blog.service.impl;

import com.dev_blog.entity.Notification;
import com.dev_blog.dto.request.ReportPostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.ReportPostResponse;
import com.dev_blog.entity.ReportPostEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.NotificationStatus;
import com.dev_blog.enums.Status;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.ReportPostMapper;
import com.dev_blog.repository.NotificationRepository;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.ReportPostRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.ReportPostService;
import com.dev_blog.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportPostServiceImpl implements ReportPostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ReportPostRepository reportPostRepository;
    private final ReportPostMapper reportPostMapper;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Override
    public ReportPostResponse createReport(ReportPostRequest request) {

        ReportPostEntity reportPostEntity = ReportPostEntity.builder()
                .post(postRepository.getReferenceById(request.getPostId()))
                .author(userRepository.getReferenceById(SecurityUtil.getCurrUser().getId()))
                .createdTime(Instant.now())
                .reason(request.getReason())
                .status(Status.PENDING)
                .build();

        reportPostRepository.save(reportPostEntity);
        return reportPostMapper.toResponse(reportPostEntity);
    }

    @Override
    public PageResponse<ReportPostResponse> getList(SearchRequest request, int page, int size) {
        Map<String, Sort> sortOptions = Map.of(
                "newest", Sort.by("createdTime").descending(),
                "oldest", Sort.by("createdTime").ascending()
        );
        Sort sort = sortOptions.getOrDefault(request.getSortBy(), Sort.by("newest").ascending());

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<ReportPostEntity> pageData = reportPostRepository.findByPostTitleAndCategoryId(request.getQuery(),
                request.getCategoryId(), pageable);

        List<ReportPostResponse> list = reportPostMapper.toResponseList(pageData.getContent());

        return PageResponse.<ReportPostResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(list)
                .build();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MOD')")
    public String handelReport(Long reportId, Status status) {
        ReportPostEntity report = reportPostRepository.findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_EXISTED));
        report.setStatus(status);
        reportPostRepository.save(report);

        if(status == Status.APPROVED) {
            notificationService.sendNotification(
                    report.getAuthor().getId(),
                    Notification.builder()
                        .status(NotificationStatus.SYSTEM)
                        .createdTime(Date.from(Instant.now()))
                        .receiver(report.getAuthor())
                        .title("Thông báo")
                        .message(String.format("Báo cáo về bài viết '%s' đã được xử lý.", report.getPost().getTitle()))
                        .build()
            );
            return "Đã xử lý báo cáo";
        }
        return "Đã từ chối báo cáo";
    }

}
