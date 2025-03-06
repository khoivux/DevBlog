package com.dev_blog.service.impl;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.entity.CategoryEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.CategoryMapper;
import com.dev_blog.repository.CategoryRepository;
import com.dev_blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryDTO createCategory(String categoryName) {
        if(categoryRepository.existsByName(categoryName))
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        return categoryMapper.toDTO(categoryRepository.save(CategoryEntity.builder().name(categoryName).build()));
    }

    @Override
    public CategoryDTO editCategory(CategoryDTO request) {
        CategoryEntity category = categoryRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        category.setName(request.getName());
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public String deleteCategory(Long categoryId) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        categoryRepository.delete(category);
        return "Danh mục đã được xóa";
    }
}
