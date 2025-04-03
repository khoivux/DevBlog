package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.enums.NotificationType;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
@Tag(name = "Notification Controller")
public class NotificationController {
    private final PostService postService;
    private final NotificationService notificationService;

    @Operation(summary = "Get User's Notification")
    @GetMapping("/{userId}")
    public ApiResponse<?> getNotificationsOfReceiver(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @PathVariable Long userId
    ) {
        return ApiResponse.builder()
                .data(notificationService.getNotificationsOfReceiver(userId, page, size))
                .build();
    }

    @Operation(summary = "Send Notification")
    @PostMapping("/")
    public ApiResponse<?> sendNotification(
            @RequestParam List<Long> receiverIds,
            @RequestParam String message
    ) {
        return ApiResponse.builder()
                .message(notificationService.sendToUsers(receiverIds, message, null, NotificationType.SYSTEM))
                .build();
    }

    @Operation(summary = "Mark As Read")
    @PostMapping("/mark-as-read/{userId}")
    public ApiResponse<?> markAsRead(
            @PathVariable Long userId
    ) {
        return ApiResponse.builder()
                .message(notificationService.markAsRead(userId))
                .build();
    }
}
