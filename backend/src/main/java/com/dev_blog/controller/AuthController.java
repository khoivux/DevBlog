package com.dev_blog.controller;

import com.nimbusds.jose.JOSEException;
import com.dev_blog.dto.request.*;
import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.AuthService;
import com.dev_blog.service.UserService;
import com.dev_blog.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Auth Controller")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @Operation(summary = "Sign-in")
    @PostMapping("/auth/login")
    public ApiResponse<?> signIn(@Valid @RequestBody AuthRequest requestDTO) {
        return ApiResponse.builder()
                .data(authService.authenticated(requestDTO))
                .message("Đăng nhập thành công")
                .build();
    }

    @Operation(summary = "Sign-up")
    @PostMapping("/auth/register")
    public ApiResponse<?> signUp(@Valid @RequestBody RegisterRequest registerRequest) {
        return ApiResponse.builder()
                .data(authService.register(registerRequest))
                .message("Đăng kí thành công")
                .build();
    }

    @Operation(summary = "Introspect")
    @PostMapping("/auth/introspect")
    public ApiResponse<?> introspect(@Valid @RequestBody IntrospectRequest requestDTO)
            throws ParseException, JOSEException {
        return ApiResponse.builder()
                .data(authService.introspect(requestDTO))
                .build();
    }
    @Operation(summary = "Refresh Token")
    @PostMapping("/auth/refresh")
    public ApiResponse<?> refreshToken(@RequestBody RefreshRequest requestDTO)
            throws ParseException, JOSEException {
        return ApiResponse.builder()
                .data(authService.refreshToken(requestDTO))
                .build();
    }

    @Operation(summary = "Logout")
    @GetMapping("/logout")
    public ApiResponse<?> logout(
            @CookieValue(value = "JWToken", required = false) String jwtToken,
            HttpServletResponse response)
                throws ParseException, JOSEException {
        String mess = "Đăng xuất thành công";
        if (jwtToken != null) {
            mess = authService.logout(LogoutRequest.builder().token(jwtToken).build());
            SecurityUtil.deleteCookies(response);
        }
        return ApiResponse.builder()
                .data(mess)
                .build();
    }
}
