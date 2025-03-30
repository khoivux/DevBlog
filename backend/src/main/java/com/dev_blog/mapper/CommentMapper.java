package com.dev_blog.mapper;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.entity.CommentEntity;
import com.dev_blog.util.DateTimeUtil;
import org.mapstruct.Mapper;

import java.util.Optional;


@Mapper(componentModel = "spring")
public interface CommentMapper {

    default CommentDTO toResponse(CommentEntity commentEntity, DateTimeUtil dateTimeUtil) {
        CommentDTO dto = new CommentDTO();
        dto.setParentId(Optional.ofNullable(commentEntity.getParent()).map(CommentEntity::getId).orElse(null));
        dto.setId(commentEntity.getId());
        dto.setAuthorId(commentEntity.getAuthor().getId());
        dto.setAuthorUsername(commentEntity.getAuthor().getUsername());
        dto.setContent(commentEntity.getContent());
        dto.setPostId(commentEntity.getPost().getId());
        dto.setCreatedTime(dateTimeUtil.format(commentEntity.getCreatedTime()));
        dto.setModifiedTime(dateTimeUtil.format(commentEntity.getModifiedTime()));
        return dto;
    }
}

