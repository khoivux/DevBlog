package com.dev_blog.mapper;

import com.dev_blog.dto.response.ReportPostResponse;
import com.dev_blog.entity.ReportPostEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReportPostMapper {
    @Mapping(target = "status", expression = "java(entity.getStatus().name().toLowerCase())")
    @Mapping(target = "authorName", expression = "java(entity.getAuthor().getUsername())")
    ReportPostResponse toResponse(ReportPostEntity entity);
    List<ReportPostResponse> toResponseList(List<ReportPostEntity> entities);
}
