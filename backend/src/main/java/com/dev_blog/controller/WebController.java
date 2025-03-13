package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.entity.Notification;
import com.dev_blog.enums.NotificationStatus;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/notification")
    public ApiResponse<?> getNotificationsOfReceiver(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "receiverId") Long receiverId
    ) {
        return ApiResponse.builder()
                .data(notificationService.getNotificationsOfReceiver(receiverId, page, size))
                .build();
    }
}
