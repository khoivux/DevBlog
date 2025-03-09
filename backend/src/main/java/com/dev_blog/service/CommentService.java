package com.dev_blog.service;

import com.dev_blog.dto.CommentDTO;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(CommentDTO request);
    List<CommentDTO> getCommentsByPost(Long postId);
    CommentDTO editComment(CommentDTO commentDTO);
}
