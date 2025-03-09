package com.dev_blog.repository;

import com.dev_blog.entity.ReportCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportCommentRepository extends JpaRepository<ReportCommentEntity, Long> {
}
