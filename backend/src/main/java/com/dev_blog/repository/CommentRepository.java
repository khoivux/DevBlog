package com.dev_blog.repository;

import com.dev_blog.model.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    void deleteAllByParentId(Long parentId);
    @Query(value = """
    WITH RECURSIVE child_comments AS (
        SELECT * FROM comment WHERE parent_id = :parentId
        UNION ALL
        SELECT c.* FROM comment c
        INNER JOIN child_comments cc ON c.parent_id = cc.id
    )
    SELECT * FROM child_comments
    """, countQuery = """
    WITH RECURSIVE child_comments AS (
        SELECT * FROM comment WHERE parent_id = :parentId
        UNION ALL
        SELECT c.* FROM comment c
        INNER JOIN child_comments cc ON c.parent_id = cc.id
    )
    SELECT COUNT(*) FROM child_comments
    """, nativeQuery = true)
    Page<CommentEntity> findAllChildren(@Param("parentId") Long parentId, Pageable pageable);
    Page<CommentEntity> findByPostIdAndParentIdIsNull(Long postId, Pageable pageable);
}
