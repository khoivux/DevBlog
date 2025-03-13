package com.dev_blog.service;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.Notification;

public interface NotificationService {

    void sendNotification(Long userId, Notification notification);

    PageResponse<Notification> getNotificationsOfReceiver(Long receiverId, int page, int size);
}
