package com.dev_blog.model;

import com.dev_blog.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id")
    @JsonIgnore
    UserEntity receiver;

    @Column(name = "redirect_url")
    String redirectUrl;

    @Column(name = "created_at")
    Date createdTime;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    NotificationType type;

    @Column(name = "message")
    String message;

    @Column(name = "isRead")
    Boolean isRead;
}
