package com.dev_blog.service.impl;

import com.dev_blog.dto.request.*;
import com.dev_blog.dto.response.AuthResponse;
import com.dev_blog.dto.response.IntrospectResponse;
import com.dev_blog.dto.response.UserResponse;
import com.dev_blog.entity.InvalidatedTokenEntity;
import com.dev_blog.entity.UserEntity;
import com.dev_blog.enums.ErrorCode;
import com.dev_blog.enums.Role;
import com.dev_blog.exception.custom.AppException;
import com.dev_blog.mapper.UserMapper;
import com.dev_blog.repository.InvalidatedTokenRepository;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.service.AuthService;
import com.dev_blog.service.EmailSerivce;
import com.dev_blog.util.ValidUserUtil;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailSerivce emailSerivce;
    private final StringRedisTemplate redisTemplate;

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
        boolean authenticated = passwordEncoder.matches(requestDTO.getPassword(), user.getPassword());
        if(!authenticated)
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        var token = generateToken(user);
        return AuthResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }

    @Override
    public String logout(LogoutRequest request) throws JOSEException, ParseException {
        SignedJWT signedJWT = verifyToken(request.getToken(), false);
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedTokenEntity invalidatedTokenEntity = InvalidatedTokenEntity.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedTokenEntity);
        return "Đăng xuất thành công!";
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest requestDTO) throws ParseException, JOSEException {
        String token = requestDTO.getToken();
        boolean isValid = true;
        try {
            SignedJWT signedJWT = verifyToken(token, false);
            log.info(signedJWT.toString());
        } catch(AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Override
    public AuthResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken(), true);
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        // Invalidate token hien tai
        InvalidatedTokenEntity invalidatedTokenEntity = InvalidatedTokenEntity.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidatedTokenEntity);
        String userName = signedJWT.getJWTClaimsSet().getSubject();
        UserEntity user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        String token = generateToken(user);
        return AuthResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }
    // Kiem tra token co hop le khong
    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);

        if(!(verified && expiryTime.after((new Date()))))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
        if(invalidatedTokenRepository.existsById(tokenId))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String generateToken(UserEntity user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(user.getId()))
                .issuer("khoivux21")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", String.join(" ", new ArrayList<>(user.getRoles())))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token!", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
