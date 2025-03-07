package com.dev_blog.service.impl;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.entity.CommentEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.CommentMapper;
import com.dev_blog.repository.CommentRepository;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.CommentService;
import com.dev_blog.util.DateTimeUtil;
import lombok.RequiredArgsConstructor;
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


    @Override
    public List<CommentDTO> getCommentsByPost(Long postId) {
        List<CommentEntity> commentEntities = commentRepository.findByPostId(postId);
        return commentEntities.stream()
                .map(comment -> commentMapper.toResponse(comment, dateTimeUtil))
                .toList();
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        CommentEntity comment = CommentEntity.builder()
                .post(postRepository.getReferenceById(commentDTO.getPostId()))
                .author(userRepository.getReferenceById(commentDTO.getAuthorId()))
                .content(commentDTO.getContent())
                .modifiedTime(Instant.now())
                .build();
        commentRepository.save(comment);
        return commentMapper.toResponse(comment, dateTimeUtil);
    }

    @Override
    public CommentDTO editComment(CommentDTO commentDTO) {
        CommentEntity comment = commentRepository.findById(commentDTO.getId())
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        comment.setContent(comment.getContent());
        comment.setModifiedTime(Instant.now());
        commentRepository.save(comment);
        return commentMapper.toResponse(comment, dateTimeUtil);
    }
}
