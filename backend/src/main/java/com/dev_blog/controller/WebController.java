package com.dev_blog.controller;

import com.dev_blog.entity.Notification;
import com.dev_blog.enums.NotificationStatus;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Web Controller")
public class WebController {
    private final PostService postService;
    private final NotificationService notificationService;


    @PostMapping("/notification")
    public ResponseEntity<String> sendNotification() {
        Notification notification = Notification.builder()
                .message("Test thông báo")
                .status(NotificationStatus.FOLLOW)
                .title("Test")
                .build();
        notificationService.sendNotification(123L, notification);
        return ResponseEntity.ok("Notification sent!");
    }
}
