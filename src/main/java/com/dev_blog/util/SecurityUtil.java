package com.dev_blog.util;


import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    private static UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        SecurityUtil.userRepository = userRepository;
    }

    public static UserEntity getCurrUser() {
        var context = SecurityContextHolder.getContext();
        return userRepository.findById(Long.valueOf(context.getAuthentication().getName()))
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public static void deleteCookies(HttpServletResponse response) {
        // Xóa cookie JWToken
        Cookie jwtCookie = new Cookie("JWToken", "");
        jwtCookie.setHttpOnly(true); // Bảo mật chống XSS
        jwtCookie.setPath("/"); // Áp dụng cho toàn bộ ứng dụng
        jwtCookie.setMaxAge(0); // Xóa ngay lập tức
        response.addCookie(jwtCookie);
    }
}
