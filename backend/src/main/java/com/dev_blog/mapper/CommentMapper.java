package com.dev_blog.mapper;

import com.dev_blog.dto.CommentDTO;
import com.dev_blog.model.CommentEntity;
import com.dev_blog.util.DateTimeUtil;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface CommentMapper {

    default CommentDTO toResponse(CommentEntity commentEntity, DateTimeUtil dateTimeUtil) {
        CommentDTO dto = new CommentDTO();
        if(commentEntity.getParent() != null) {
            dto.setParentId(commentEntity.getId());
            dto.setReplyTo(commentEntity.getParent().getAuthor().getDisplayName());
            dto.setUsernameReply(commentEntity.getParent().getAuthor().getUsername());
        }
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

