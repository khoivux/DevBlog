package com.dev_blog.service.impl;


import com.dev_blog.dto.request.ChangePasswordRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.model.Notification;
import com.dev_blog.model.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.NotificationType;
import com.dev_blog.enums.Role;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.UserMapper;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.UserPostCount;
import com.dev_blog.service.UserService;
import com.dev_blog.util.DateTimeUtil;
import com.dev_blog.util.SecurityUtil;
import com.dev_blog.util.ValidUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final PostRepository postRepository;

    @Override
    public PageResponse<UserResponse> getList(SearchRequest request, int page, int size) {
        DateTimeUtil.checkDateRange(request.getStartDate(), request.getEndDate());

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<UserPostCount> pageData = userRepository.findUsersWithPostCount(
                request.getQuery(),
                request.getStartDate(),
                request.getEndDate(),
                request.getSortBy(),
                pageable
        );

        List<UserResponse> userList = pageData.stream()
                .filter(u -> !u.getUser().getRoles().contains(Role.ADMIN.name()))
                .map(upc -> {
                    UserResponse dto = userMapper.toResponseDTO(upc.getUser());
                    dto.setCountPost(upc.getPostCount());
                    return dto;
                })
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(size)
                .data(userList)
                .build();
    }

    @Override
    public UserResponse findByUsername(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponse getCurrentUser() {
        return userMapper.toResponseDTO(SecurityUtil.getCurrUser());
    }

    @Override
    public UserResponse findByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UserUpdateRequest request) {
        UserEntity user = userRepository.findById(SecurityUtil.getCurrUser().getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        ValidUserUtil.validateUserUpdate(request, user);

        if(request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        user.setDisplayName(request.getDisplayName());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setIntroduction(request.getIntroduction());

        return userMapper.toResponseDTO(userRepository.save(user));
    }


    @Override
    public String changePassword(ChangePasswordRequest request) {
        if(!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
        UserEntity user = SecurityUtil.getCurrUser();
        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.LOGIN_FAILED);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Đổi mật khẩu thành công";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public String setRole(String username, String role) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(role.equals(Role.MOD.name())) {
            user.getRoles().add(Role.MOD.name());
        }
        else {
            if(!user.getRoles().contains(Role.MOD.name()))
                throw new AppException(ErrorCode.NOT_HAVE_ROLE);
            user.getRoles().remove(Role.MOD.name());
        }
        userRepository.save(user);
        notificationService.sendNotification(
                Notification.builder()
                        .type(NotificationType.SYSTEM)
                        .createdTime(Date.from(Instant.now()))
                        .isRead(false)
                        .message("Bạn được cấp quyền kiểm duyệt" +
                                "\n Bạn có thể duyệt bài/báo cáo")
                        .receiver(user)
                        .build()
        );
        return "Phân quyền thành công";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public String blockOrActive(String username, Boolean blocked) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setIsBlocked(blocked);
        userRepository.save(user);

        if(Boolean.TRUE.equals(blocked))
            return "Khóa tài khoản @" + user.getUsername() + " thành công!";
        return "Mở khóa tài khoản @" + user.getUsername() + " thành công";
    }
}
