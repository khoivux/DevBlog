package com.dev_blog.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dev_blog.service.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {
    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        log.info("Image URL: {}", uploadResult.get("url").toString());
        return uploadResult.get("url").toString();
    }

    @Override
    public void deleteFile(String imageUrl) throws IOException {
        Map result = cloudinary.uploader().destroy(extractPublicId(imageUrl), ObjectUtils.emptyMap());
        log.info("Delete Result: {}", result.get("result"));
    }

    private String extractPublicId(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1]; // Lấy phần cuối cùng của URL
        return fileName.split("\\.")[0]; // Loại bỏ phần mở rộng (.png, .jpg, ...)
    }
}
