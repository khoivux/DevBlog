package com.dev_blog.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthRequest {
    @Size(min = 3, message = "INVALID_USERNAME")
    String input;
    @Size(min = 5, message = "INVALID_PASSWORD")
    String password;
}
