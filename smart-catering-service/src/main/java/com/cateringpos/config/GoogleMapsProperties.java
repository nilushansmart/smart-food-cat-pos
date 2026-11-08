package com.cateringpos.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.google-maps")
@Getter
@Setter
public class GoogleMapsProperties {
    private String apiKey;
    private String kitchenAddress = "88 Culinary Boulevard, Suite 400";
}

