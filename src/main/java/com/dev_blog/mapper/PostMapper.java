package com.dev_blog.mapper;


import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.entity.PostEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toResponse(PostEntity postEntity);
}
