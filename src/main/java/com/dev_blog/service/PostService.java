package com.dev_blog.service;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;

public interface PostService {

    PostResponse createPost(PostCreateRequest postRequest);
    PostResponse editPost(PostRequest postRequest);
    PostResponse getSinglePost(Long postId);
    PageResponse<PostResponse> searchPost(String query, Long categoryId, String sortBy, int page, int size);
    PageResponse<PostResponse> getPostsByUser(int page, int size, Long userId);
    PageResponse<PostResponse> getAll(int page, int size);
    String deletePost(Long postId);
    String handlePost(Long postId, String status);
    String votePost(Long postId, String voteType);
    void increaseView(Long postId);
    boolean isAuthor(Long postId);
}
