package com.dev_blog.repository;


import com.dev_blog.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long> {
    Page<PostEntity> findAllByAuthorId(Long authorId, Pageable pageable);
    Page<PostEntity> findAll(Pageable pageable);
    @Query("SELECT p FROM PostEntity p WHERE " +
            "(:query IS NULL OR :query = '' OR " +
            " LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            " LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<PostEntity> searchPosts(@Param("query") String query,
                                 @Param("categoryId") Long categoryId,
                                 Pageable pageable);


}
