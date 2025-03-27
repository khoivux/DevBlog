package com.dev_blog.service;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.dto.response.PageResponse;

public interface CommentService {
    PageResponse<CommentDTO> getCommentsByPost(int page, int size, Long postId);
    CommentDTO createComment(CommentDTO request);
    CommentDTO editComment(CommentDTO commentDTO);

    String deleteComment(Long commentId);
}
