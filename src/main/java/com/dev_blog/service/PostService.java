package com.dev_blog.service;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;

public interface PostService {
    PostResponse createPost(PostCreateRequest postRequest);
    PostResponse editPost(PostRequest postRequest);
    PageResponse<PostResponse> getMyPosts(int page, int size);
    String deletePost(Long postId);
    PostResponse getSinglePost(Long postId);
    String votePost(Long postId, String voteType);
    boolean isAuthor(Long postId);
    PageResponse<PostResponse> searchPost(String query, String categoryId, String sortBy, int page, int size);
}
