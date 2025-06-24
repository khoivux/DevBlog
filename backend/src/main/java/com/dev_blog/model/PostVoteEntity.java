package com.dev_blog.model;

import com.dev_blog.enums.VoteType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "post_vote")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostVoteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    PostEntity post;

    @ManyToOne
    @JoinColumn(name = "voter_id", nullable = false)
    UserEntity voter;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    VoteType type;
}
