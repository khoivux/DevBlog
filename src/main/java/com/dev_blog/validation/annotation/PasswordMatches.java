package com.dev_blog.validation.annotation;


import com.dev_blog.validation.validator.PasswordMatchesValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordMatchesValidator.class) // Gọi sang Validator
@Target( { ElementType.FIELD, ElementType.TYPE }) // Áp dụng Annotation cho Method, Field,...
@Retention(RetentionPolicy.RUNTIME) // Chạy trong môi trường Runtim
public @interface PasswordMatches {
    String message() default "Mật khẩu xác nhận sai";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
