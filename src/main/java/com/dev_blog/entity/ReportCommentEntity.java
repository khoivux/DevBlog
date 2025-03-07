package com.dev_blog.entity;

import com.dev_blog.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "report_comment")
public class ReportCommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private CommentEntity comment;

    @ManyToOne
    @JoinColumn(name = "author", nullable = false)
    private UserEntity author;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "created_time", nullable = false)
    private Instant createdTime = Instant.now();

}
