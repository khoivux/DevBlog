package com.dev_blog.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchRequest {
    String query;
    Long categoryId;
    String sortBy;
    String status;

    public SearchRequest(String query, Long categoryId, String sortBy) {

    }
}
