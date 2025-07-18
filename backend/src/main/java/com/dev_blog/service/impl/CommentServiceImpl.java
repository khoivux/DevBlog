package com.dev_blog.service.impl;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.dto.request.CommentRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.model.CommentEntity;
import com.dev_blog.model.Notification;
import com.dev_blog.model.PostEntity;
import com.dev_blog.model.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.NotificationType;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.CommentMapper;
import com.dev_blog.repository.CommentRepository;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.CommentService;
import com.dev_blog.service.NotificationService;
import com.dev_blog.util.DateTimeUtil;
import com.dev_blog.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final DateTimeUtil dateTimeUtil;
    private final NotificationService notificationService;

    @Override
    public PageResponse<CommentDTO> getParentComments(int page, int size, Long postId) {
        Sort sort = Sort.by("createdTime").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<CommentEntity> pageData = commentRepository.findByPostIdAndParentIdIsNull(postId, pageable);

        List<CommentDTO> list = pageData.getContent().stream()
                .map(comment -> commentMapper.toResponse(comment, dateTimeUtil))
                .toList();

        return PageResponse.<CommentDTO>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(list)
                .build();
    }

    @Override
    public PageResponse<CommentDTO> getChildComments(int page, int size, Long parentId) {
        Sort sort = Sort.by("created_time").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<CommentEntity> pageData = commentRepository.findAllChildren(parentId, pageable);

        List<CommentDTO> list = pageData.getContent().stream()
                .map(comment -> commentMapper.toResponse(comment, dateTimeUtil))
                .toList();

        return PageResponse.<CommentDTO>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(list)
                .build();
    }

    @Override
    public CommentDTO createComment(CommentRequest comment) {
        PostEntity post = postRepository.findById(comment.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        UserEntity user = SecurityUtil.getCurrUser();

        CommentEntity newComment = CommentEntity.builder()
                .post(post)
                .author(user)
                .parent(comment.getParentId() != null ?
                        commentRepository.findById(comment.getParentId()).orElse(null) : null)
                .content(comment.getContent())
                .createdTime(Instant.now())
                .modifiedTime(null)
                .build();
        commentRepository.save(newComment);

        if(!Objects.equals(user.getId(), post.getAuthor().getId())) {
            notificationService.sendNotification(
                    Notification.builder()
                            .type(NotificationType.COMMENT)
                            .isRead(false)
                            .createdTime(Date.from(Instant.now()))
                            .message(user.getDisplayName() + " đã bình luận bài viết của bạn")
                            .receiver(post.getAuthor())
                            .redirectUrl("/post/" + post.getId())
                            .build()
            );
        }

        return commentMapper.toResponse(newComment, dateTimeUtil);
    }

    @Override
    public CommentDTO editComment(CommentDTO commentDTO) {
        CommentEntity comment = commentRepository.findById(commentDTO.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        comment.setContent(commentDTO.getContent());
        comment.setModifiedTime(Instant.now());
        commentRepository.save(comment);
        return commentMapper.toResponse(comment, dateTimeUtil);
    }

    @Transactional
    @Override
    public String deleteComment(Long commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        commentRepository.deleteAllByParentId(commentId);
        commentRepository.delete(comment);
        return "Xóa bình luận thành công";
    }
}
