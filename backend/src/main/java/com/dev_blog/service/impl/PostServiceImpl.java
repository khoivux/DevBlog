package com.dev_blog.service.impl;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.entity.PostEntity;
import com.dev_blog.entity.PostVoteEntity;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Status;
import com.dev_blog.enums.VoteType;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.PostMapper;
import com.dev_blog.repository.CategoryRepository;
import com.dev_blog.repository.PostRepository;
import com.dev_blog.repository.PostVoteRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.PostService;
import com.dev_blog.util.DateTimeUtil;
import com.dev_blog.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostMapper postMapper;
    private final DateTimeUtil dateTimeUtil;
    private final PostVoteRepository postVoteRepository;


    @Override
    public PageResponse<PostResponse> getAll(int page, int size) {
        Sort sort = Sort.by("id").descending();

        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<PostEntity> pageData = postRepository.findAll(pageable);

        List<PostResponse> postList = pageDataToResponseList(pageData);
        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    @Override
    @Transactional
    public void increaseView(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        if(post.getStatus() == Status.APPROVED) {
            post.setViews(post.getViews() + 1);
            postRepository.save(post);
        }
    }

    @Override
    @Transactional
    public PostResponse createPost(PostCreateRequest postRequest) {
        Long authorId = SecurityUtil.getCurrUser().getId();
        String status = SecurityUtil.getRole().contains("ADMIN") ? "APPROVED" : "PENDING";
        return postMapper.toResponse(
                postRepository.save(PostEntity.builder()
                    .author(userRepository.getById(authorId))
                    .category(categoryRepository.getById(postRequest.getCategoryId()))
                    .title(postRequest.getTitle())
                    .content(postRequest.getContent())
                    .status(Status.valueOf(status))
                    .views(0L)
                    .createdTime(Instant.now())
                    .modifiedTime(Instant.now())
                    .build()));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @postService.isAuthor(#postRequest.id)")
    public PostResponse editPost(PostRequest postRequest) {
        PostEntity post = postRepository.findById(postRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        post.setContent(postRequest.getContent());
        post.setTitle(postRequest.getTitle());
        post.setModifiedTime(Instant.now());
        PostResponse postResponse = postMapper.toResponse(postRepository.save(post));
        postResponse.setCreated(dateTimeUtil.format(post.getCreatedTime()));
        return postResponse;
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @postService.isAuthor(#postId)")
    public String deletePost(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        postRepository.deleteById(postId);
        return "Xóa bài viết thành công!";
    }

    @Override
    public String handlePost(Long postId, Status status) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        post.setStatus(status);
        postRepository.save(post);
        if(status == Status.APPROVED)
            return "Duyệt bài thành công";
        return "Từ chối duyệt thành công";
    }

    @Override
    public PostResponse getSinglePost(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));

        if (!SecurityUtil.getRole().contains("ADMIN")
                && post.getStatus() != (Status.APPROVED)
                && !post.getAuthor().getUsername().equals(SecurityUtil.getCurrUser().getUsername())) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        PostResponse postResponse = postMapper.toResponse(post);
        postResponse.setAuthorUserName(post.getAuthor().getUsername());
        postResponse.setAuthorName(post.getAuthor().getDisplayName());
        postResponse.setCreated(dateTimeUtil.format(post.getCreatedTime()));
        postResponse.setLike(postVoteRepository.countVotesByPostId(postId, VoteType.LIKE));
        postResponse.setDislike(postVoteRepository.countVotesByPostId(postId, VoteType.DISLIKE));
        return postResponse;
    }

    @Override
    @Transactional
    public String votePost(Long postId, VoteType voteType) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXISTED));
        UserEntity currUser = SecurityUtil.getCurrUser();
        Optional<PostVoteEntity> postVote = postVoteRepository.findByPostAndVoter(post, currUser);

        if(voteType == VoteType.NONE)
            postVote.ifPresent(postVoteRepository::delete);

        postVote.ifPresentOrElse(
                existingVote -> {
                    existingVote.setType(voteType);
                    postVoteRepository.save(existingVote);
                },
                () -> {
                    postVoteRepository.save(PostVoteEntity.builder()
                            .post(post)
                            .voter(currUser)
                            .type(voteType)
                            .build());
                }
        );
        return "Vote thành công";
    }

    @Override
    public PageResponse<PostResponse> getPostsByUser(int page, int size, Long authorId) {
        Sort sort = Sort.by("createdTime").descending();

        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<PostEntity> pageData = postRepository.findAllByAuthorId(authorId, pageable);

        List<PostResponse> postList = pageDataToResponseList(pageData);

        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    @Override
    public PageResponse<PostResponse> searchPost(String query, Long categoryId, String sortBy, int page, int size) {
        Map<String, Sort> sortOptions = Map.of(
                "newest", Sort.by("createdTime").descending(),
                "oldest", Sort.by("createdTime").ascending(),
                "popular", Sort.by("views").descending()
        );
        Sort sort = sortOptions.getOrDefault(sortBy, Sort.by("id").ascending());


        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<PostEntity> pageData = postRepository.searchPosts(query, categoryId, pageable);

        List<PostResponse> postList = pageDataToResponseList(pageData);
        return PageResponse.<PostResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(postList)
                .build();
    }

    @Override
     public boolean isAuthor(Long postId) {
        return postRepository.findById(postId)
                .map(post -> post.getAuthor().getUsername()
                        .equals(SecurityUtil.getCurrUser().getUsername()))
                .orElse(false);
    }

    private List<PostResponse> pageDataToResponseList(Page<PostEntity> pageData) {
        String username = SecurityUtil.getCurrUser().getUsername();
        boolean isAdmin = SecurityUtil.getRole().contains("ADMIN");
        return pageData.getContent().stream()
                .filter(post -> isAdmin || post.getStatus() == (Status.APPROVED) || post.getAuthor().getUsername().equals(username))
                .map(post -> {
                    PostResponse postResponse = postMapper.toResponse(post);
                    postResponse.setAuthorUserName(post.getAuthor().getUsername());
                    postResponse.setAuthorName(post.getAuthor().getDisplayName());
                    postResponse.setCreated(dateTimeUtil.format(post.getCreatedTime()));
                    return postResponse;
                }).toList();
    }
}
