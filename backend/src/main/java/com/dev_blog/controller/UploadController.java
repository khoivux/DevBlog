package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.service.UploadService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {
    private final UploadService uploadService;

    @Operation(summary = "Upload File")
    @PostMapping("")
    public ApiResponse<?> uploadFile (@RequestParam("file") MultipartFile file) {
        try {
            return ApiResponse.builder()
                    .data(uploadService.uploadFile(file))
                    .message("Tải file thành công")
                    .build();
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FAIL);
        }
    }
}
