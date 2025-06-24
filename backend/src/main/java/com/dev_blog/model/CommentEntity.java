package com.dev_blog.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ReportCommentEntity> reportComments;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CommentEntity parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<CommentEntity> replies = new ArrayList<>();

    @Column(name = "created_time", nullable = false)
    Instant createdTime = Instant.now();

    @Column(name = "modified_time")
    Instant modifiedTime;
}
