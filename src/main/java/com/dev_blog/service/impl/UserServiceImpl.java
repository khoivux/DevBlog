package com.dev_blog.service.impl;


import com.dev_blog.dto.request.UserUpdateRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.UserMapper;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.UserService;
import com.dev_blog.util.SecurityUtil;
import com.dev_blog.util.ValidUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponse<UserResponse> searchUser(String query, String sortBy, int page, int size) {
        Sort sort = Sort.by("id").ascending();
        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<UserEntity> pageData = userRepository.findByKeyword(query, pageable);
        List<UserResponse> userList = pageData.getContent().stream().map(userMapper::toResponseDTO).toList();

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
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> findAll(int page, int size) {
        Sort sort = Sort.by("id").ascending();
        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<UserEntity> pageData = userRepository.findAll(pageable);
        List<UserResponse> userList = pageData.getContent().stream().map(userMapper::toResponseDTO).toList();
        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .pageSize(size)
                .data(userList)
                .build();
    }

    @Override
    public UserResponse getCurrUser() {
        UserEntity user = userRepository.findById(SecurityUtil.getCurrUser().getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UserUpdateRequest request) {
        UserEntity user = userRepository.findById(SecurityUtil.getCurrUser().getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        ValidUserUtil.validateUserUpdate(request, user);
        user.setDisplayName(request.getDisplayName());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        return userMapper.toResponseDTO(userRepository.save(user));
    }
}
