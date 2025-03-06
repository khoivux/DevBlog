package com.dev_blog.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthResponse {
    String token;
    boolean authenticated;
}
