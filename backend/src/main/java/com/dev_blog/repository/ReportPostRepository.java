package com.dev_blog.repository;

import com.dev_blog.entity.ReportPostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportPostRepository extends JpaRepository<ReportPostEntity, Long> {
}
