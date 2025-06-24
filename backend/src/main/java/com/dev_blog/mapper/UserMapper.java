package com.dev_blog.mapper;


import com.dev_blog.dto.request.RegisterRequest;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper (componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "firstname", target = "firstname")
    @Mapping(source = "lastname", target = "lastname")
    UserEntity toEntity(RegisterRequest registerRequest);

    UserResponse toResponseDTO(UserEntity userEntity);
    List<UserResponse> toResponseDTOs(List<UserEntity> userEntities);
}
