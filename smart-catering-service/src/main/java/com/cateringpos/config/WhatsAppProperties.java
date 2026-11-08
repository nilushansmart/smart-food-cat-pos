package com.cateringpos.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.whatsapp")
@Getter
@Setter
public class WhatsAppProperties {
    private String defaultProvider = "deeplink"; // deeplink or cloudapi
    private CloudApi cloudApi = new CloudApi();
    private DeepLink deepLink = new DeepLink();

    @Getter
    @Setter
    public static class CloudApi {
        private String apiUrl = "https://graph.facebook.com/v18.0";
        private String phoneNumberId;
        private String accessToken;
    }

    @Getter
    @Setter
    public static class DeepLink {
        private String baseUrl = "https://wa.me/";
    }
}

