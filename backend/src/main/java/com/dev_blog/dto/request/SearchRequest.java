package com.dev_blog.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

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
    Instant startDate;
    Instant endDate;

    public SearchRequest(String query, Long categoryId, String sortBy) {
        this.query = query;
        this.categoryId = categoryId;
        this.sortBy = sortBy;
    }

    public SearchRequest(String query, Long categoryId, String sortBy, String status) {
        this.query = query;
        this.categoryId = categoryId;
        this.sortBy = sortBy;
        this.status = status;
    }

    public SearchRequest(String query, String sortBy, Instant startDate, Instant endDate) {
        this.query = query;
        this.sortBy = sortBy;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
