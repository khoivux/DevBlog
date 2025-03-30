package com.dev_blog.util;


import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Role;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.UserRepository;
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

    public static boolean isMod() {
        return getRoles().contains(Role.MOD.name());
    }

    public static boolean isAdmin() {
        return getRoles().contains(Role.ADMIN.name());
    }

    public static boolean isNormalUser() {
        return !isAdmin() && !isMod();
    }

    private static String getRoles() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .toString();
    }

}
