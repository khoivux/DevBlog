package com.dev_blog.controller;

import com.dev_blog.dto.response.ApiResponse;
import com.dev_blog.service.NotificationService;
import com.dev_blog.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Tag(name = "Web Controller")
public class WebController {
    private final PostService postService;
    private final NotificationService notificationService;

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
