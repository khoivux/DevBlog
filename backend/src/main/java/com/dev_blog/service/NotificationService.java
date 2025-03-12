package com.dev_blog.service;

import com.dev_blog.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, Notification notification) {
        log.info("Sending WS noti to {} with payload {}", userId, notification);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/notification",
                notification
        );
    }
}
