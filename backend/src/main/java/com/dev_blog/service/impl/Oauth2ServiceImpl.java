package com.dev_blog.service.impl;

import com.dev_blog.enums.Provider;
import com.dev_blog.security.oauth2.Oauth2UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
public class Oauth2ServiceImpl {
    private final ClientRegistrationRepository clientRegistrationRepository;

    public Oauth2UserInfo authenticateAndFetchInfor(Provider provider, String code) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());

//        Oauth2Client clientDetail = getClientDetail(provider);
//        Oauth2Provider oauth2Provider = getProviderDetail(provider);

return null;

    }

//    private Oauth2Client getClientDetail (Provider provider) {
//        ClientRegistration clientRegistration =
//                clientRegistrationRepository.findByRegistrationId(provider.toString());
//        return Oauth2Client.builder()
//                .clientId(clientRegistration.getClientId())
//                .clientSecret(clientRegistration.getClientId())
//                .redirectUri(clientRegistration.getRedirectUri())
//                .build();
//    }
//
//    private Oauth2Provider getProviderDetail(Provider provider) {
//        ClientRegistration clientRegistration =
//                clientRegistrationRepository.findByRegistrationId(provider.toString());
//        return Oauth2Provider.builder()
//                .tokenUri(clientRegistration.getProviderDetails().getTokenUri())
//                .userInfoUri(clientRegistration.getProviderDetails().getUserInfoEndpoint().getUri())
//                .build();
//    }
}
