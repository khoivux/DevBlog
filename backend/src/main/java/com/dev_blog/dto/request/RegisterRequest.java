package com.dev_blog.dto.request;


import com.dev_blog.validation.annotation.PasswordMatches;
import com.dev_blog.validation.annotation.PhoneNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PasswordMatches()
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank
    String firstname;
    @NotBlank
    String lastname;
    @Size(min = 3, message = "INVALID_USERNAME")
    String username;
    @Size(min = 5, message = "INVALID_PASSWORD")
    String password;
    @PhoneNumber(message = "INVALID_PHONE")
    String phone;
    @Email(message = "INVALID_EMAIL")
    String email;
    String confirmPassword;
}
