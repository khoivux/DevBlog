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

    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);

    @Query(nativeQuery = true, value = "SELECT u.id FROM user u " +
            "JOIN user_entity_roles ur ON u.id = ur.user_entity_id " +
            "WHERE ur.role = 'MOD'")
    List<Long> findModeratorIds();

    @Query(nativeQuery = true, value = "SELECT * FROM `user` " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(display_name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(SUBSTRING_INDEX(email, '@', 1)) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<UserEntity> findByKeyword(@Param("keyword") String keyword, Pageable pageable);


}
