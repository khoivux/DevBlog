package com.dev_blog.repository;

import com.dev_blog.model.PostEntity;
import com.dev_blog.model.PostVoteEntity;
import com.dev_blog.model.UserEntity;
import com.dev_blog.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostVoteRepository extends JpaRepository<PostVoteEntity, Long> {
    @Query("SELECT COUNT(v) FROM PostVoteEntity v WHERE v.post.id = :postId AND v.type = :type")
    Long countVotesByPostId(@Param("postId") Long postId, @Param("type") VoteType type);
    Optional<PostVoteEntity> findByPostAndVoter(PostEntity post, UserEntity voter);
}
