package com.dev_blog.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshRequest {
    String token;
}
