package com.dev_blog.validation.annotation;

import com.dev_blog.validation.validator.PhoneValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneValidator.class) // Gọi sang Validator
@Target( { ElementType.FIELD }) // Áp dụng Annotation cho Method, Field,...
@Retention(RetentionPolicy.RUNTIME) // Chạy trong môi trường Runtime
public @interface PhoneNumber {
    String message() default "Số điện thoại không hợp lệ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
