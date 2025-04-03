package com.dev_blog.util;


import com.dev_blog.dto.request.RegisterRequest;
import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidUserUtil {
    private static UserRepository userRepository;

    @Autowired
    public ValidUserUtil(UserRepository userRepository) {
        ValidUserUtil.userRepository = userRepository; // Inject repository vào static field
    }

    public static void validateUserRegister(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        } else if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        } else if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
    }
    public static  void validateUserUpdate(UserUpdateRequest request, UserEntity user) {
        if (!request.getUsername().equals(user.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        } else if (!request.getPhone().equals(user.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONENUMBER_EXISTED);
        }
    }
}
