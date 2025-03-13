package com.dev_blog.service.impl;

import com.dev_blog.dto.response.PageResponse;
import com.dev_blog.entity.Notification;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotification(Long userId, Notification notification) {
        log.info("Sending WS noti to {} with payload {}", userId, notification);
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/notification",
                notification
        );
    }

    @Override
    public PageResponse<Notification> getNotificationsOfReceiver(Long receiverId, int page, int size) {
        Sort sort = Sort.by("createdTime").ascending();

        Pageable pageable = (Pageable) PageRequest.of(page - 1, size, sort);
        Page<Notification> pageData = notificationRepository.findByReceiver(userRepository.getReferenceById(receiverId), pageable);

        return PageResponse.<Notification>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPage(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent())
                .build();
    }
}
