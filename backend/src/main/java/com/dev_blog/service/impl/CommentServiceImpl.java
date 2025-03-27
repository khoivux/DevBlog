package com.dev_blog.service.impl;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.entity.Notification;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.CommentEntity;
import com.dev_blog.entity.PostEntity;
import com.dev_blog.entity.UserEntity;
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

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
    public PageResponse<CommentDTO> getCommentsByPost(int page, int size, Long postId) {
        Sort sort = Sort.by("createdTime").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<CommentEntity> pageData = commentRepository.findByPostId(postId, pageable);

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
    public CommentDTO createComment(CommentDTO commentDTO) {
        PostEntity post = postRepository.findById(commentDTO.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        UserEntity user = userRepository.findById(commentDTO.getAuthorId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        CommentEntity comment = CommentEntity.builder()
                .post(post)
                .author(user)
                .parent(commentRepository.findById(commentDTO.getParentId()).orElse(null))
                .content(commentDTO.getContent())
                .createdTime(Instant.now())
                .modifiedTime(Instant.now())
                .build();
        commentRepository.save(comment);

        notificationService.sendNotification(
                post.getAuthor().getId(),
                Notification.builder()
                        .type(NotificationType.COMMENT)
                        .message(user.getDisplayName() + " đã bình luận bài viết của bạn")
                        .title("Thông báo")
                        .build()
        );

        return commentMapper.toResponse(comment, dateTimeUtil);
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

    @Override
    public String deleteComment(Long commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        commentRepository.deleteAllByParentId(commentId);
        commentRepository.delete(comment);
        return "Xóa bình luận thành công";
    }
}
