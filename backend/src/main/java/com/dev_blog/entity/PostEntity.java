package com.dev_blog.entity;

import com.dev_blog.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "post")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "content", nullable = false)
    String content;

    @Column(name = "created_time", nullable = false)
    Instant createdTime;

    @Column(name = "modified_time")
    Instant modifiedTime;

    @Column(name = "views")
    Long views;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    Status status;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    UserEntity author;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    CategoryEntity category;
}
