package com.dev_blog.service;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.enums.Status;
import com.dev_blog.enums.VoteType;

public interface PostService {

    PostResponse createPost(PostCreateRequest postRequest);
    PostResponse editPost(PostRequest postRequest);
    PostResponse getSinglePost(Long postId);
    PageResponse<PostResponse> getPostsByUser(int page, int size, String sortBy, Long userId);
    String deletePost(Long postId);
    String handlePost(Long postId, Status status);
    String votePost(Long postId, VoteType voteType);
    PageResponse<PostResponse> getList(SearchRequest request, int page, int size);

    void increaseView(Long postId);
    boolean isAuthor(Long postId);
}
