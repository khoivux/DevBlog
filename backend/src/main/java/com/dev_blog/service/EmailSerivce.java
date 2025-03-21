package com.dev_blog.service;

public interface EmailSerivce {
    void sendEmail(String receiver, String subject, String body);
}
