package com.cateringpos.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@ConfigurationProperties(prefix = "app.catering")
@Getter
@Setter
public class CateringProperties {
    private String name = "Stitch Gourmet Catering";
    private String address = "88 Culinary Boulevard, Suite 400";
    private String phone = "+1 (800) 555-FOOD";
    private String email = "orders@stitchcatering.com";
    private BigDecimal taxRate = new BigDecimal("0.05");
    private String currency = "$";
}

