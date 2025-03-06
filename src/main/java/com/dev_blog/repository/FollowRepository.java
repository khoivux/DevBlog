package com.dev_blog.repository;

import com.dev_blog.entity.FollowEntity;
import com.dev_blog.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
    boolean existsByFollowerAndFollowedUser(UserEntity follower, UserEntity followedUser);
    Optional<FollowEntity> findByFollowerAndFollowedUser(UserEntity follower, UserEntity followedUser);
    Page<FollowEntity> findByFollowedUser(UserEntity followedUser, Pageable pageable);
    Page<FollowEntity> findByFollower(UserEntity follower, Pageable pageable);
    Long countByFollower(UserEntity user);
    Long countByFollowedUser(UserEntity user);
}
