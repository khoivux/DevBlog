package com.dev_blog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(hidden = true)
    Long postId;
    @Schema(hidden = true)
    Long parentId;
    @Schema(hidden = true)
    Long authorId;
    @Schema(hidden = true)
    String authorUsername;
    @NotBlank(message = "EMPTY_DATA")
    String content;
    @Schema(hidden = true)
    String createdTime;
    @Schema(hidden = true)
    String modifiedTime;
    @Schema(hidden = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String replyTo;
    @Schema(hidden = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String usernameReply;
}
