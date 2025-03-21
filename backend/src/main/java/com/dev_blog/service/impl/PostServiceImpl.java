package com.dev_blog.service.impl;


import com.dev_blog.dto.request.PostCreateRequest;
import com.dev_blog.dto.request.PostRequest;
import com.dev_blog.dto.request.SearchRequest;
import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.dto.response.PostResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.entity.Notification;
import com.dev_blog.entity.PostEntity;
import com.dev_blog.entity.PostVoteEntity;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Role;
import com.dev_blog.enums.Status;
import com.dev_blog.enums.VoteType;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.PostMapper;
import com.dev_blog.repository.*;
import com.dev_blog.service.FollowService;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.PostService;
import com.dev_blog.service.UploadService;
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
import java.util.*;

@Service("postService")
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostMapper postMapper;
    private final DateTimeUtil dateTimeUtil;
    private final PostVoteRepository postVoteRepository;
    private final FollowService followService;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UploadService uploadService;


    @Override
    public PageResponse<PostResponse> getList(SearchRequest request, int page, int size) {
        Map<String, Sort> sortOptions = Map.of(
                "newest", Sort.by("created_time").descending(),
                "oldest", Sort.by("created_time").ascending(),
                "popular", Sort.by("views").descending()
        );
        Sort sort = sortOptions.getOrDefault(request.getSortBy(), Sort.by("id").ascending());

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<PostEntity> pageData = postRepository.searchPosts(request.getQuery(), request.getStatus(),
                request.getCategoryId(), pageable);

        List<PostResponse> postList = pageDataToResponseList(pageData, request.getStatus());

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
        String status = SecurityUtil.getRole().contains(Role.ADMIN.toString()) ? "APPROVED" : "PENDING";

        // Lưu bài viết mới
        PostEntity newPost = postRepository.save(PostEntity.builder()
                .author(userRepository.getReferenceById(authorId))
                .category(categoryRepository.getReferenceById(postRequest.getCategoryId()))
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .thumbnailUrl(postRequest.getThumbnailUrl())
                .status(Status.valueOf(status))
                .views(0L)
                .createdTime(Instant.now())
                .modifiedTime(Instant.now())
                .build());

        // Thông báo cho tất cả người theo dõi
        List<UserResponse> followers = followService.getFollowers(1, 5, SecurityUtil.getCurrUser().getUsername()).getData();
        for(UserResponse follower : followers) {
            Notification notification = Notification.builder()
                    .createdTime(Date.from(Instant.now()))
                    .message(SecurityUtil.getCurrUser().getDisplayName() + " đã đăng một bài viết mới")
                    .redirectUrl("/post/" + newPost.getId())
                    .receiver(userRepository.getReferenceById(follower.getId()))
                    .build();
            notificationService.sendNotification(follower.getId(), notification);
        }

        return postMapper.toResponse(newPost);
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
        post.setThumbnailUrl(postRequest.getThumbnailUrl());

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

        postRepository.delete(post);
        return "Xóa bài viết thành công!";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
        postResponse.setAuthorUsername(post.getAuthor().getUsername());
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
                () -> postVoteRepository.save(PostVoteEntity.builder()
                        .post(post)
                        .voter(currUser)
                        .type(voteType)
                        .build())
        );

        return "Vote thành công";
    }

    @Override
    public PageResponse<PostResponse> getPostsByUser(int page, int size, String sortBy, Long authorId) {
        Sort sort = Sort.by("createdTime").descending();
        if(!sortBy.equals("popular"))
            sort = Sort.by("views").descending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<PostEntity> pageData = postRepository.findAllByAuthorId(authorId, pageable);

        List<PostResponse> postList = pageDataToResponseList(pageData, null);

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

    private List<PostResponse> pageDataToResponseList(Page<PostEntity> pageData, String status) {
        String username = SecurityUtil.getCurrUser().getUsername();
        boolean isAdmin = SecurityUtil.getRole().contains("ADMIN");
        // Chỉ là adin hoặc bài viết được duyệt hoặc chủ bài viết mới nhìn thấy
        return pageData.getContent().stream()
                .filter(post -> isAdmin || post.getStatus() == (Status.APPROVED) ||
                        post.getAuthor().getUsername().equals(username) || Objects.equals(status, Status.APPROVED.toString())
                )
                .map(post -> {
                    PostResponse postResponse = postMapper.toResponse(post);
                    postResponse.setAuthorUsername(post.getAuthor().getUsername());
                    postResponse.setAuthorName(post.getAuthor().getDisplayName());
                    postResponse.setCreated(dateTimeUtil.format(post.getCreatedTime()));
                    return postResponse;
                }).toList();
    }
}
