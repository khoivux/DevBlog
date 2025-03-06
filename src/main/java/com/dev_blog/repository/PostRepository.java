package com.dev_blog.repository;


import com.dev_blog.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {
    Page<PostEntity> findAllByAuthorId(Long authorId, Pageable pageable);
    Page<PostEntity> findByContentContaining(String query, Pageable pageable);
}
