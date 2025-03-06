package com.dev_blog.service;

import com.dev_blog.dto.CategoryDTO;

public interface CategoryService {
    CategoryDTO createCategory(String categoryName);
    CategoryDTO editCategory(CategoryDTO request);
    String deleteCategory(Long categoryId);
}
