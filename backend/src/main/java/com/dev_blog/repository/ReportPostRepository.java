package com.dev_blog.repository;

import com.dev_blog.entity.ReportPostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportPostRepository extends JpaRepository<ReportPostEntity, Long> {
    @Query("""
        SELECT r FROM ReportPostEntity r
        WHERE (:title IS NULL OR LOWER(r.post.title) LIKE LOWER(CONCAT('%', :title, '%')))
        AND (r.status = 'PENDING')
        AND (:categoryId IS NULL OR r.post.category.id = :categoryId)
    """)
    Page<ReportPostEntity> findByPostTitleAndCategoryId(
            String title,
            Long categoryId,
            Pageable pageable
    );
}
