package com.dev_blog.mapper;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.model.CategoryEntity;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toDTO(CategoryEntity categoryEntity);
}