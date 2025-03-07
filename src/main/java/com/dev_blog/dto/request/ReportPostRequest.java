package com.dev_blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportPostRequest {
    @NotBlank(message = "EMPTY_DATA")
    Long postId;
    @NotBlank(message = "EMPTY_DATA")
    String reason;
    @NotBlank(message = "EMPTY_DATA")
    Long userId;
}
