package com.dev_blog.exception.custom;


import com.dev_blog.enums.ErrorCode;
import lombok.Getter;


@Getter
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
