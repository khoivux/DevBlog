package com.dev_blog.service.impl;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.Notification;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.NotificationType;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.repository.NotificationRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotification(Notification notification) {
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(notification.getReceiver().getId()),
                "/notification",
                notification
        );
    }

    @Override
    public String sendToUsers(List<Long> userIds, String message, String redirectUrl, NotificationType type) {
        for(Long userId : userIds) {
            UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            Notification notification = Notification.builder()
                    .isRead(false)
                    .createdTime(Date.from(Instant.now()))
                    .receiver(user)
                    .message(message)
                    .redirectUrl(redirectUrl)
                    .type(type)
                    .isRead(false)
                    .build();
            sendNotification(notification);
        }
        return "Gửi thông báo thành công";
    }

    @Override
    public PageResponse<Notification> getNotificationsOfReceiver(Long receiverId, int page, int size) {
        Sort sort = Sort.by("createdTime").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Notification> pageData = notificationRepository.findByReceiver(userRepository.getReferenceById(receiverId), pageable);

        return PageResponse.<Notification>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }

    @Override
    public String markAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdAndIsReadFalse(userId);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
        return "Đã cập nhật trạng thái thông báo";
    }
}
