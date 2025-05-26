package com.dev_blog.controller;

import com.dev_blog.dto.request.*;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.dto.response.AuthResponse;
import com.dev_blog.dto.response.IntrospectResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.service.AuthService;
import com.nimbusds.jose.JOSEException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth Controller")
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "Sign-in")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> signIn(@Valid @RequestBody AuthRequest requestDTO) {
        return ApiResponse.<AuthResponse>builder()
                .data(authService.authenticated(requestDTO))
                .message("Đăng nhập thành công")
                .build();
    }

    @Operation(summary = "Sign-up")
    @PostMapping("/register")
    public ApiResponse<UserResponse> signUp(@Valid @RequestBody RegisterRequest registerRequest) {
        return ApiResponse.<UserResponse>builder()
                .data(authService.register(registerRequest))
                .message("Đăng kí thành công")
                .build();
    }

    @Operation(summary = "Introspect")
    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@Valid @RequestBody IntrospectRequest requestDTO) {
        try {
            return ApiResponse.<IntrospectResponse>builder()
                    .data(authService.introspect(requestDTO))
                    .build();
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Operation(summary = "Refresh Token")
    @PostMapping("/refresh")
    public ApiResponse<?> refreshToken(@RequestBody RefreshRequest requestDTO) {
        try {
            return ApiResponse.builder()
                    .data(authService.refreshToken(requestDTO))
                    .build();
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestBody LogoutRequest request) {
        try {
            return ApiResponse.builder()
                    .message(authService.logout(request))
                    .build();
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Operation(summary = "Verify Email")
    @PostMapping("/verify-email")
    public ApiResponse<Object> verifyEmail(@RequestParam String email, @RequestParam String otp) {
        return ApiResponse.builder()
                .data(authService.verifyEmail(email, otp))
                .message("Xác thực OTP thành công")
                .build();
    }

    @Operation(summary = "Reset password")
    @PutMapping("/reset-password")
    public ApiResponse<Object> resetPassword(@RequestParam String email, @RequestParam String password, @RequestParam String confirmPassword) {
        return ApiResponse.builder()
                .message(authService.resetPassword(email, password, confirmPassword))
                .build();
    }
}
