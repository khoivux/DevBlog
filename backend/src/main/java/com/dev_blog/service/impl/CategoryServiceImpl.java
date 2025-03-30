package com.dev_blog.service.impl;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.CategoryEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.CategoryMapper;
import com.dev_blog.repository.CategoryRepository;
import com.dev_blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public PageResponse<CategoryDTO> getList(int page, int size, String query) {
        Sort sort = Sort.by("id").ascending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<CategoryEntity> pageData = categoryRepository.findByNameContaining(query, pageable);

        List<CategoryDTO> categoryList = pageData.getContent().stream()
                .map(categoryMapper::toDTO).toList();

        return PageResponse.<CategoryDTO>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(categoryList)
                .build();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN')")
    public CategoryDTO createCategory(String categoryName) {
        if(categoryRepository.existsByName(categoryName))
            throw new AppException(ErrorCode.CATEGORY_EXISTED);

        return categoryMapper.toDTO(categoryRepository.save(
                CategoryEntity.builder().name(categoryName).build())
        );
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN')")
    public CategoryDTO editCategory(CategoryDTO request) {
        CategoryEntity category = categoryRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        category.setName(request.getName());
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN')")
    public String deleteCategory(Long categoryId) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        categoryRepository.delete(category);
        return "Danh mục đã được xóa";
    }
}
