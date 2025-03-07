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
public class ReportCommentDTO {
    Long id;
    Long authorId;
    Long commentId;
    @NotBlank(message = "EMPTY_DATA")
    String reason;
    CommentDTO comment;
    String createdTime;
    String status;
    String authorName;
}
