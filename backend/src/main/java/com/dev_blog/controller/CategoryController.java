package com.dev_blog.controller;

import com.dev_blog.dto.CategoryDTO;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/category")
@Tag(name = "Category Controller")
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(summary = "All Category")
    @GetMapping("/all")
    public ApiResponse<?> getAll(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        return ApiResponse.builder()
                .data(categoryService.getAll(page, size))
                .message("Tạo danh mục thành công")
                .build();
    }

    @Operation(summary = "Create Category")
    @PostMapping("/create")
    public ApiResponse<?> createCategory(@RequestParam String categoryName) {
        return ApiResponse.builder()
                .data(categoryService.createCategory(categoryName))
                .message("Tạo danh mục thành công")
                .build();
    }

    @Operation(summary = "Edit Category")
    @PostMapping("/edit")
    public ApiResponse<?> editCategory(@Valid @RequestBody CategoryDTO request) {
        return ApiResponse.builder()
                .data(categoryService.editCategory(request))
                .message("Chỉnh sửa danh mục thành công")
                .build();
    }

    @Operation(summary = "Delete Category")
    @PostMapping("/delete")
    public ApiResponse<?> deleteCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ApiResponse.builder()
                .message("Xóa danh mục thành công")
                .build();
    }
}
