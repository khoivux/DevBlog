package com.dev_blog.security.oauth2;

import com.dev_blog.enums.Provider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class Oauth2UserInfoFactory {
    public static Oauth2UserInfo getOauth2UserInfo(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> new GoogleUserInfo(attributes);
            case GITHUB -> new GithubUserInfo(attributes);
        };
    }
}
