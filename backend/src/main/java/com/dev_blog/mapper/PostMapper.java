package com.dev_blog.mapper;


import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.model.PostEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "status", expression = "java(postEntity.getStatus().name().toLowerCase())")
    @Mapping(target = "authorName", expression = "java(postEntity.getAuthor().getUsername())")
    PostResponse toResponse(PostEntity postEntity);
}
