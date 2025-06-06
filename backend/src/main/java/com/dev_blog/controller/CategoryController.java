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
    @GetMapping("/")
    public ApiResponse<?> getList(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(required = false) String query
    ) {
        return ApiResponse.builder()
                .data(categoryService.getList(page, size, query))
                .message("Lấy danh sách danh mục thành công")
                .build();
    }

    @Operation(summary = "Create Category")
    @PostMapping("/create")
    public ApiResponse<?> createCategory(@RequestParam String categoryName) {
        return ApiResponse.builder()
                .data(categoryService.createCategory(categoryName.trim()))
                .message("Tạo danh mục thành công")
                .build();
    }

    @Operation(summary = "Edit Category")
    @PutMapping("/edit")
    public ApiResponse<?> editCategory(@Valid @RequestBody CategoryDTO request) {
        return ApiResponse.builder()
                .data(categoryService.editCategory(request))
                .message("Chỉnh sửa danh mục thành công")
                .build();
    }

    @Operation(summary = "Delete Category")
    @DeleteMapping("/delete")
    public ApiResponse<?> deleteCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ApiResponse.builder()
                .message("Xóa danh mục thành công")
                .build();
    }
}
