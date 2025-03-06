package com.dev_blog.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {
    int currentPage;
    int totalPage;
    int pageSize;
    long totalElements;
    @Builder.Default
    private List<T> data = Collections.emptyList();
}
