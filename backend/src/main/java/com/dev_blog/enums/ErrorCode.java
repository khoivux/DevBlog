package com.dev_blog.enums;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_OK(1000, "OK", HttpStatus.OK),
    USER_EXISTED(1001, "Tài khoản đã tồn tại", HttpStatus.CONFLICT),
    USER_NOT_EXISTED(1002, "Tài khoản Không tồn tại", HttpStatus.NOT_FOUND),
    INVALID_USERNAME(1003, "Username phải có tối thiểu {min} kí tự", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Mật khẩu phải có tối thiểu {min} kí tự", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1005, "Email không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1006, "Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1007, "Email đã tồn tại", HttpStatus.CONFLICT),
    UNAUTHENTICATED(1008, "Ban can dang nhap tai khoan", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1009, "Bạn không được cấp quyền", HttpStatus.FORBIDDEN),
    PASSWORD_NOT_MATCHED(1010, "Mật khẩu xác nhận không đúng", HttpStatus.BAD_REQUEST),
    POST_NOT_EXISTED(1011, "Bài viết không tồn tại", HttpStatus.NOT_FOUND),
    PHONENUMBER_EXISTED(1012, "Số điện thoại đã tồn tại", HttpStatus.CONFLICT),
    CATEGORY_EXISTED(1013, "Danh mục đã tồn tại", HttpStatus.CONFLICT),
    CATEGORY_NOT_EXISTED(1014, "Danh mục không tồn tại", HttpStatus.NOT_FOUND),
    ACCESS_DENIED(1015, "Không cho phép truy cập", HttpStatus.FORBIDDEN),
    REPORT_NOT_EXISTED(1016, "Báo cáo không tồn tại", HttpStatus.NOT_FOUND),
    COMMENT_NOT_EXISTED(1017, "Bình luận không tồn tại", HttpStatus.NOT_FOUND),
    EMPTY_DATA(1018, "Vui lòng nhập đầy đủ thông tin", HttpStatus.BAD_REQUEST),
    UPLOAD_FAIL(1019, "Không thể tải file", HttpStatus.BAD_REQUEST),
    NOT_HAVE_ROLE(1020, "Chức năng không thuộc quyền hạn người dùng", HttpStatus.FORBIDDEN),
    BLOCKED_USER(1021 ,"Tài khoản này đã bị khóa", HttpStatus.BAD_REQUEST),
    LOGIN_FAILED(1022 ,"Tên tài khoản hoặc mật khẩu không đúng", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_EXISTED(1023 ,"Email chưa được đăng ký", HttpStatus.NOT_FOUND),
    INVALID_DATE_RANGE(1024, "Lỗi ngày không hợp lệ", HttpStatus.BAD_REQUEST);
    ;
    private final int code;
    private final String message;
    private final HttpStatus status;
    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

}
