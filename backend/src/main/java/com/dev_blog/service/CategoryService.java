package com.dev_blog.service;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.dto.response.PageResponse;


public interface CategoryService {
    PageResponse<CategoryDTO> getList(int page, int size, String query);
    CategoryDTO createCategory(String categoryName);
    CategoryDTO editCategory(CategoryDTO request);
    String deleteCategory(Long categoryId);
}
