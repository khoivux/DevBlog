package com.dev_blog.service;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.dto.request.CommentRequest;
import com.dev_blog.dto.response.PageResponse;

public interface CommentService {
    PageResponse<CommentDTO> getParentComments(int page, int size, Long postId);
    PageResponse<CommentDTO> getChildComments(int page, int size, Long parentId);
    CommentDTO createComment(CommentRequest request);
    CommentDTO editComment(CommentDTO commentDTO);
    String deleteComment(Long commentId);
}
