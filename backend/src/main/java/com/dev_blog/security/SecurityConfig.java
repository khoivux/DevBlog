package com.dev_blog.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Lazy
    private CustomJwtDecoder customJwtDecoder;

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    private final String[] PUBLIC_ENDPOINTS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/api/v1/auth/**",
            "/api/v1/email/**",
            "/ws/**"
    };

    private final String[] PUBLIC_ENDPOINTS_GET = {
            "/api/v1/post/**",
            "/api/v1/category/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET).permitAll()
                        .anyRequest().authenticated()
                )
                .cors(Customizer.withDefaults()); // Kích hoạt CORS theo CorsConfig
//                .exceptionHandling(exception -> exception
//                        .authenticationEntryPoint((request, response, authException) ->
//                                response.sendRedirect("/sign-in") // Redirect về /sign-in nếu chưa đăng nhập
//                        )
//

        // Cấu hình OAuth2 xử lý yêu cầu có JWT
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder) // Phương thức giải mã JWT
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()) // Chuyển đổi quyền từ JWT
                )
                .bearerTokenResolver(new CookieBearerTokenResolver()) // Đọc JWT từ Cookie
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()) // Xử lý lỗi xác thực
        );

        return httpSecurity.build();
    }


    // Chuyen thong tin JWT thanh authorities
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
