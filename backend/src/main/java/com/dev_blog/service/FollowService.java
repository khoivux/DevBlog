package com.dev_blog.service;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;

import java.util.Map;

public interface FollowService {
    String followUser(Long followedId);
    String unfollowUser(Long followedId);
    PageResponse<UserResponse> getFollowers(int page, int size, Long followedId);
    PageResponse<UserResponse> getFollowing(int page, int size, Long followerId);
    Map<String, Long> getFollowCount(Long userId);
}
