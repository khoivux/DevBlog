package com.dev_blog.validation.validator;


import com.dev_blog.dto.request.RegisterRequest;
import com.dev_blog.validation.annotation.PasswordMatches;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, RegisterRequest> {
    @Override
    public boolean isValid(RegisterRequest user, ConstraintValidatorContext context) {
        boolean isValid = user.getPassword() != null && user.getPassword().equals(user.getConfirmPassword());
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("PASSWORD_NOT_MATCHED")
                    .addPropertyNode("confirmPassword") // Gán cho lỗi vào field cụ thể (confirmpassword)
                    .addConstraintViolation();
        }
        return isValid;
    }
}
