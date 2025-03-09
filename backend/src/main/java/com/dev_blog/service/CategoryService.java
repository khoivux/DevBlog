package com.dev_blog.service;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.dto.response.PageResponse;


public interface CategoryService {
    PageResponse<CategoryDTO> getAll(int page, int size);
    CategoryDTO createCategory(String categoryName);
    CategoryDTO editCategory(CategoryDTO request);
    String deleteCategory(Long categoryId);
}
