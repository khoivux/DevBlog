package com.dev_blog.service;

import com.dev_blog.exception.custom.ResourceNotFoundException;
import com.dev_blog.model.RedisToken;
import com.dev_blog.repository.RedisTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisTokenService {
    private final RedisTokenRepository redisTokenRepository;

    public void save(RedisToken token) {
        RedisToken res = redisTokenRepository.save(token);
        log.info("Token ID: {}", res.getId());
    }

    public void delete(String id) {
        redisTokenRepository.deleteById(id);
    }

    public RedisToken getById(String id) {
        return redisTokenRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Redis Token not found"));
    }
}
