package com.dev_blog.repository;


import com.dev_blog.entity.UserEntity;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(@NotBlank(message = "INVALID_USERNAME") String userName);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    @Query("SELECT u.id FROM UserEntity u WHERE 'MOD' MEMBER OF u.roles")
    List<Long> findModeratorIds();
    Optional<UserEntity> findByUsername(String username);
    @Query(nativeQuery = true, value = "SELECT * FROM `user` " +
            "WHERE LOWER(username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(display_name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<UserEntity> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


}
