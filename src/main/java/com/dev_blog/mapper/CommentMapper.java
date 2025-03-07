package com.dev_blog.mapper;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.entity.CommentEntity;
import com.dev_blog.util.DateTimeUtil;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface CommentMapper {

    default CommentDTO toResponse(CommentEntity commentEntity, DateTimeUtil dateTimeUtil) {
        CommentDTO dto = new CommentDTO();
        dto.setParentId(commentEntity.getParent().getId());
        dto.setId(commentEntity.getId());
        dto.setAuthorId(commentEntity.getAuthor().getId());
        dto.setAuthorName(commentEntity.getAuthor().getUsername());
        dto.setContent(commentEntity.getContent());
        dto.setPostId(commentEntity.getPost().getId());
        dto.setCreatedTime(dateTimeUtil.format(commentEntity.getCreatedTime()));
        dto.setModifiedTime(dateTimeUtil.format(commentEntity.getCreatedTime()));
        return dto;
    }
}

