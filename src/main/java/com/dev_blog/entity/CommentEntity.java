package com.dev_blog.entity;

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
@Table(name = "comment")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "content", nullable = false)
    String content;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    UserEntity author;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    PostEntity post;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    CommentEntity parent;

    @Column(name = "created_time", nullable = false)
    Instant createdTime = Instant.now();

    @Column(name = "modified_time", nullable = false)
    Instant modifiedTime;
}
