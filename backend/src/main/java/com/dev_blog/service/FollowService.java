package com.dev_blog.service;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.UserResponse;

public interface FollowService {
    String followUser(Long followedId);
    String unfollowUser(Long followedId);
    PageResponse<UserResponse> getFollowers(int page, int size, String followedUsername);
    PageResponse<UserResponse> getFollowing(int page, int size, String followerUsername);
}
