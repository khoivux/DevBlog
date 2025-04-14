package com.dev_blog.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "lastname", nullable = false)
    String lastname;
    @Column(name = "firstname", nullable = false)
    String firstname;
    @Column(name = "display_name")
    String displayName;
    @Column(name = "username", unique = true, columnDefinition =  "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;
    @Column(name = "password", nullable = false)
    String password;
    @Column(name = "phone")
    String phone;
    @Column(name = "email", nullable = false)
    String email;
    @Column(name = "introduction")
    String introduction;
    @Column(name = "avatar_url")
    String avatarUrl;
    @Column(name = "is_blocked")
    Boolean isBlocked = false;
    @ElementCollection
    @Column(name = "role")
    Set<String> roles;
}
