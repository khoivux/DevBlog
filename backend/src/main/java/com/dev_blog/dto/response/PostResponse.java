package com.dev_blog.dto.response;

import com.dev_blog.dto.CategoryDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String title;
    String content;
    String created;
    Long like;
    Long dislike;
    Instant createdTime;
    Instant modifiedTime;
    String authorName;
    String authorUsername;
    CategoryDTO category;
    String status;
    String thumbnailUrl;
}
