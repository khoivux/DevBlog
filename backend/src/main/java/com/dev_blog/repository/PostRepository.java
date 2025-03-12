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

    @Query(value = """
    SELECT * FROM post p
    WHERE (:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
    OR LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) )
    AND (:categoryId IS NULL OR p.category_id = :categoryId)
    AND (:status IS NULL OR p.status = :status)
    """, nativeQuery = true)
    Page<PostEntity> searchPosts(@Param("query") String query,
                                 @Param("status") String status,
                                 @Param("categoryId") Long categoryId,
                                 Pageable pageable);
}
