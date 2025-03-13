package com.dev_blog.dto.request;
import com.dev_blog.validation.annotation.PhoneNumber;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String firstname;
    String lastname;
    @NotBlank(message = "EMPTY_DATA")
    String username;
    @PhoneNumber(message = "INVALID_PHONE")
    String phone;
    String displayName;
    String introduction;
    String email;
    String avatarUrl;
}
