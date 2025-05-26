package com.dev_blog.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    @Size(min = 5, message = "INVALID_PASSWORD")
    private String oldPassword;
    @Size(min = 5, message = "INVALID_PASSWORD")
    private String newPassword;
    @Size(min = 5, message = "INVALID_PASSWORD")
    private String confirmNewPassword;
}
