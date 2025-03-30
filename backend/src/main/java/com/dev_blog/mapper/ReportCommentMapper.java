package com.dev_blog.mapper;

import com.dev_blog.dto.ReportCommentDTO;
import com.dev_blog.entity.ReportCommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReportCommentMapper {
    @Mapping(target = "status", expression = "java(entity.getStatus().name().toLowerCase())")
    @Mapping(target = "authorName", expression = "java(entity.getAuthor().getUsername())")
    ReportCommentDTO toResponse(ReportCommentEntity entity);


    List<ReportCommentDTO> toResponseList(List<ReportCommentEntity> content);
}
