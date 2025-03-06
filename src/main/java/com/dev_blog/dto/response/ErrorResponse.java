package com.dev_blog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private Date timestamp;
    private String path;
    private int code;
    private String error;
    private String message;
}
