package com.dev_blog.validation.validator;


import com.dev_blog.validation.annotation.PhoneNumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<PhoneNumber, String> {
    @Override
    public void initialize(PhoneNumber constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if(phone == null){
            return false;
        }
        //validate phone numbers of format "0902345345"
        if (phone.matches("\\d{10}")) return true;
            //validating phone number with -, . or spaces: 090-234-4567
        else if(phone.matches("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}")) return true;
            //validating phone number with extension length from 3 to 5
        else //return false if nothing matches the input
            if(phone.matches("\\d{3}-\\d{3}-\\d{4}\\s(x|(ext))\\d{3,5}")) return true;
                //validating phone number where area code is in braces ()
            else return phone.matches("\\(\\d{3}\\)-\\d{3}-\\d{4}");
    }
}
