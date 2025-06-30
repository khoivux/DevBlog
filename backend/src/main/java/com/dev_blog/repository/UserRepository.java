package com.dev_blog.repository;


import com.dev_blog.model.UserEntity;
import com.dev_blog.service.UserPostCount;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {
    boolean existsByUsername(@NotBlank(message = "INVALID_USERNAME") String userName);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Optional<UserEntity> findByUsernameOrEmail(String username, String email);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);

    @Query(nativeQuery = true, value = "SELECT u.id FROM user u " +
            "JOIN user_entity_roles ur ON u.id = ur.user_entity_id " +
            "WHERE ur.role = 'MOD'")
    List<Long> findModeratorIds();

    @Query("""
        SELECT u AS user, COUNT(p) AS postCount
        FROM UserEntity u
        LEFT JOIN PostEntity p ON p.author.id = u.id
            AND (:startDate IS NULL OR p.createdTime >= :startDate)
            AND (:endDate IS NULL OR p.createdTime <= :endDate)
        WHERE (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')))
        GROUP BY u
        ORDER BY 
            CASE WHEN :sortDir = 'desc' THEN COUNT(p) END DESC,
            CASE WHEN :sortDir = 'asc' THEN COUNT(p) END ASC,
            u.id ASC
    """)
    Page<UserPostCount> findUsersWithPostCount(
            @Param("keyword") String keyword,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            @Param("sortDir") String sortDir,
            Pageable pageable);
}
