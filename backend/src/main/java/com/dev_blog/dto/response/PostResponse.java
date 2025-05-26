package com.dev_blog.dto.response;

import com.dev_blog.dto.CategoryDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String status;
    String thumbnailUrl;
    String title;
    String description;
    String content;
    String createdTime;
    String modifiedTime;
    Long like;
    Long dislike;
    String authorName;
    String authorUsername;
    CategoryDTO category;
}
