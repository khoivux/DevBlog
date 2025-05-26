package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.EmailSerivce;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/email")
@Tag(name = "Email Controller")
public class EmailController {
    private final EmailSerivce emailSerivce;

    @Operation(summary = "Send OTP")
    @PostMapping("/send-otp")
    public ApiResponse<?> sendOTP(@RequestParam String email) {
        return ApiResponse.builder()
                .data(emailSerivce.sendOTP(email))
                .message("Đã gửi OTP thành công")
                .build();
    }
}
