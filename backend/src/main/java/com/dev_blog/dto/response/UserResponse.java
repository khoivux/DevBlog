package com.dev_blog.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String firstname;
    String lastname;
    String displayName;
    String username;
    String introduction;
    String phone;
    String email;
    String avatarUrl;
    Long countPost;
    Boolean isBlocked;
    Set<String> roles;
}
