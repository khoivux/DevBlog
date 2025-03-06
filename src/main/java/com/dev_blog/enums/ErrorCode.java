package com.dev_blog.enums;


import org.springframework.http.HttpStatus;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_OK(1000, "OK", HttpStatus.OK),
    USER_EXISTED(1001, "Username đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1002, "Username Không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_USERNAME(1003, "Username phải có tối thiểu {min} kí tự", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Mật khẩu phải có tối thiểu {min} kí tự", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1005, "Email không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1006, "Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1007, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1008, "Authentication failed", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1009, "Bạn không được cấp quyền", HttpStatus.FORBIDDEN),
    PASSWORD_NOT_MATCHED(1010, "Mật khẩu xác nhận không đúng", HttpStatus.BAD_REQUEST),
    POST_NOT_EXISTED(1011, "Bài viết không tồn tại", HttpStatus.NOT_FOUND),
    PHONENUMBER_EXISTED(1012, "Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1013, "Danh mục đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1014, "Danh mục không tồn tại", HttpStatus.NOT_FOUND)
    ;
    private int code;
    private String message;
    private HttpStatus status;
    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
