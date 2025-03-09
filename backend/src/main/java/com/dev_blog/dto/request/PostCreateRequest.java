package com.dev_blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostCreateRequest {
    @NotBlank(message = "EMPTY_DATA")
    Long categoryId;
    @NotBlank(message = "EMPTY_DATA")
    String title;
    @NotBlank(message = "EMPTY_DATA")
    String content;
}

