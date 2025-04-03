package com.dev_blog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentDTO {
    Long id;
    Long postId;
    Long parentId;
    Long authorId;
    String authorUsername;
    @NotBlank(message = "EMPTY_DATA")
    String content;
    String createdTime;
    String modifiedTime;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String replyTo;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String usernameReply;
}
