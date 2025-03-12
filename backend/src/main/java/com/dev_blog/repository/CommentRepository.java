package com.dev_blog.repository;

import com.dev_blog.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    Page<CommentEntity> findByPostId(Long postId, Pageable pageable);
}
