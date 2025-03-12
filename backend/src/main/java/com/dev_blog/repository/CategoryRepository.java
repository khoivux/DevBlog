package com.dev_blog.repository;

import com.dev_blog.entity.CategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    boolean existsByName(String name);
    Page<CategoryEntity> findByNameContaining(String keyword, Pageable pageable);
}
