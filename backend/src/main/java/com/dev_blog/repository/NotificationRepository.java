package com.dev_blog.repository;

import com.dev_blog.entity.Notification;
import com.dev_blog.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByReceiver(UserEntity receiver, Pageable pageable);
}
