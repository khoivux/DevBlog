package com.dev_blog.service.impl;

import com.dev_blog.dto.request.AuthRequest;
import com.dev_blog.dto.request.LogoutRequest;
import com.dev_blog.dto.request.RegisterRequest;
import com.dev_blog.dto.response.AuthResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Role;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.exception.custom.InvalidDataException;
import com.dev_blog.mapper.UserMapper;
import com.dev_blog.model.RedisToken;
import com.dev_blog.model.UserEntity;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.AuthService;
import com.dev_blog.service.EmailSerivce;
import com.dev_blog.service.JwtService;
import com.dev_blog.service.RedisTokenService;
import com.dev_blog.util.SecurityUtil;
import com.dev_blog.util.ValidUserUtil;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Collections;
import java.util.HashSet;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailSerivce emailSerivce;
    private final StringRedisTemplate redisTemplate;
    private final JwtService jwtService;
    private final RedisTokenService redisTokenService;


    protected String DEFAULT_AVATAR_URL = "http://res.cloudinary.com/drdjvonsx/image/upload/v1741858825/ad2h5wifjk0xdqmawf9x.png";

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Override
    public UserResponse register(RegisterRequest registerRequest) {
        ValidUserUtil.validateUserRegister(registerRequest);
        UserEntity userEntity = userMapper.toEntity(registerRequest);

        userEntity.setDisplayName(registerRequest.getFirstname() + " " + registerRequest.getLastname());
        userEntity.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userEntity.setAvatarUrl(DEFAULT_AVATAR_URL);
        userEntity.setRoles(new HashSet<>(Collections.singletonList(Role.USER.name())));
        return userMapper.toResponseDTO(userRepository.save(userEntity));
    }

    @Override
    public boolean verifyEmail(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisTemplate.delete(email);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public String resetPassword(String email, String newPassword, String confirmPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(!newPassword.equals(confirmPassword)) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Đặt lại mật khẩu thành công";
    }

    @Override
    public AuthResponse authenticated(AuthRequest requestDTO) {
        UserEntity user = userRepository.findByUsernameOrEmail(requestDTO.getInput(), requestDTO.getInput())
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(Boolean.TRUE.equals(user.getIsBlocked()))
            throw new AppException(ErrorCode.BLOCKED_USER);
        if(!passwordEncoder.matches(requestDTO.getPassword(), user.getPassword()))
            throw new AppException(ErrorCode.LOGIN_FAILED);

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        redisTokenService.save(RedisToken.builder().id(user.getUsername()).accessToken(accessToken).refreshToken(refreshToken).build());

        return AuthResponse.builder()
                .authenticated(true)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public String logout(LogoutRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        if(token == null || token.isEmpty() || !jwtService.verifyToken(token)) {
            throw new InvalidDataException("Token không hợp lệ");
        }
        String userName = SecurityUtil.getCurrUser().getUsername();
        redisTokenService.delete(userName);
        return "Đăng xuất thành công!";
    }

     @Override
    public AuthResponse refresh(String refreshToken) {
        if(refreshToken == null || refreshToken.isEmpty() || !jwtService.verifyToken(refreshToken)) {
            throw new InvalidDataException("Token không hợp lệ");
        }
        Long userId = Long.parseLong(jwtService.extractUserId(refreshToken));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));
        String accessToken = jwtService.generateAccessToken(user);
        RedisToken redisToken = redisTokenService.getById(user.getUsername());
        redisTokenService.save(RedisToken.builder().id(user.getUsername()).accessToken(accessToken).refreshToken(refreshToken).build());
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }
}
