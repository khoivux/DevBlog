package com.dev_blog.service;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.model.Notification;
import com.dev_blog.enums.NotificationType;

import java.util.List;

public interface NotificationService {

    void sendNotification(Notification notification);
    String sendToUsers(List<Long> userIds, String message, String redirectUrl, NotificationType type);
    PageResponse<Notification> getNotificationsOfReceiver(Long receiverId, int page, int size);
    String markAsRead(Long userId);
}
