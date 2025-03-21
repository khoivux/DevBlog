package com.dev_blog.service.impl;

import com.dev_blog.entity.Notification;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.entity.FollowEntity;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.NotificationStatus;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.UserMapper;
import com.dev_blog.repository.FollowRepository;
import com.dev_blog.repository.NotificationRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.FollowService;
import com.dev_blog.service.NotificationService;
import com.dev_blog.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final UserMapper userMapper;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public String followUser(Long followedId) {
        UserEntity followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserEntity follower = SecurityUtil.getCurrUser();
        if(followRepository.existsByFollowerAndFollowedUser(follower, followedUser)) {
            return "Đã theo dõi người dùng";
        }

        followRepository.save(FollowEntity.builder()
                        .follower(follower)
                        .followedUser(followedUser)
                        .createdTime(Instant.now())
                        .build());

        notificationService.sendNotification(
                followedId,
                Notification.builder()
                    .status(NotificationStatus.FOLLOW)
                    .createdTime(Date.from(Instant.now()))
                    .receiver(followedUser)
                    .redirectUrl(null)
                    .message(follower.getDisplayName() + " đã theo dõi bạn")
                    .title("Thông báo")
                    .build()
        );

        return "Bạn đã theo dõi " + followedUser.getDisplayName();
    }

    @Override
    @Transactional
    public String unfollowUser(Long followedId) {
        UserEntity followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        UserEntity follower = SecurityUtil.getCurrUser();

        Optional<FollowEntity> follow = followRepository.findByFollowerAndFollowedUser(follower, followedUser);

        if (follow.isEmpty()) {
            return "Chưa theo dõi";
        }

        followRepository.delete(follow.get());
        return "Bạn đã hủy theo dõi " + followedUser.getDisplayName();
    }

    @Override
    public PageResponse<UserResponse> getFollowers(int page, int size, String followedUsername) {
        UserEntity followedUser = userRepository.findByUsername(followedUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Sort sort = Sort.by("createdTime").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<FollowEntity> pageData = followRepository.findByFollowedUser(followedUser, pageable);

        List<UserResponse> followers = pageData.getContent().stream()
                .map(follow -> userMapper.toResponseDTO(follow.getFollower()))
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(followers)
                .build();
    }

    @Override
    public PageResponse<UserResponse> getFollowing(int page, int size, String followerUsername) {
        UserEntity follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Sort sort = Sort.by("createdTime").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<FollowEntity> pageData = followRepository.findByFollower(follower, pageable);

        List<UserResponse> followedList = pageData.getContent().stream()
                .map(follow -> userMapper.toResponseDTO(follow.getFollowedUser()))
                .toList();

        return PageResponse.<UserResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(followedList)
                .build();
    }

    @Override
    public Map<String, Long> getFollowCount(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        long followersCount = followRepository.countByFollowedUser(user);
        long followingCount = followRepository.countByFollower(user);

        return Map.of(
                "followersCount", followersCount,
                "followingCount", followingCount
        );
    }
}
