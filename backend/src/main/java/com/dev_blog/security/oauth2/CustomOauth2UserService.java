package com.dev_blog.security.oauth2;

import com.dev_blog.enums.Provider;
import com.dev_blog.enums.Role;
import com.dev_blog.exception.custom.ResourceNotFoundException;
import com.dev_blog.model.UserEntity;
import com.dev_blog.repository.UserRepository;
import com.dev_blog.util.ValidUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOauth2User(oAuth2UserRequest, oAuth2User);
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOauth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        Oauth2UserInfo oauth2UserInfo = Oauth2UserInfoFactory.getOauth2UserInfo(Provider.fromString(registrationId), oAuth2User.getAttributes());

        if(StringUtils.isEmpty(oauth2UserInfo.getEmail())) {
            throw new ResourceNotFoundException("Email not found from OAuth2 provider");
        }
        Optional<UserEntity> userOptional = userRepository.findByEmail(oauth2UserInfo.getEmail());
        UserEntity user;
        if(!userOptional.isPresent()) {
            user = UserEntity.builder()
                    .email(oauth2UserInfo.getEmail())
                    .firstname(oauth2UserInfo.getFirstname())
                    .lastname(oauth2UserInfo.getLastname())
                    .displayName(oauth2UserInfo.getFullName())
                    .username(ValidUserUtil.generateUsername(oauth2UserInfo.getEmail()))
                    .avatarUrl(oauth2UserInfo.getAvatarUrl())
                    .roles(new HashSet<>(Collections.singletonList(Role.USER.name())))
                    .password(" ")
                    .phone(" ")
                    .socialLogin(true)
                    .build();
            userRepository.save(user);
        } else {
            user = userOptional.get();
        }
        return new CustomOauth2User(user, oauth2UserInfo.getAttributes());
    }
}