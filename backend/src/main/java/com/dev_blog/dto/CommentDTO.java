package com.dev_blog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentDTO {
    Long id;
    @NotBlank(message = "EMPTY_DATA")
    Long postId;
    @NotBlank(message = "EMPTY_DATA")
    Long authorId;
    Long parentId;
    @NotBlank(message = "EMPTY_DATA")
    String authorName;
    @NotBlank(message = "EMPTY_DATA")
    String content;
    String createdTime;
    String modifiedTime;
}
