package com.dev_blog.dto;

import com.dev_blog.enums.NotificationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    Long receiverId;
    NotificationStatus status;
    String message;
    String title;
}
