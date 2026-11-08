package com.cateringpos.service.impl;

import com.cateringpos.config.CateringProperties;
import com.cateringpos.config.WhatsAppProperties;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.entity.Order;
import com.cateringpos.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service("cloudapi")
@RequiredArgsConstructor
public class WhatsAppCloudApiServiceImpl implements WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppCloudApiServiceImpl.class);

    private final CateringProperties cateringProperties;
    private final WhatsAppProperties whatsAppProperties;
    private final WhatsAppDeepLinkServiceImpl deepLinkService;

    @Override
    public WhatsAppShareResponse sendOrPrepareReceipt(Order order, String receiptUrl) {
        String phoneNumberId = whatsAppProperties.getCloudApi().getPhoneNumberId();
        String accessToken = whatsAppProperties.getCloudApi().getAccessToken();

        // If credentials are not provided, fall back gracefully to deep-link
        if (!StringUtils.hasText(phoneNumberId) || !StringUtils.hasText(accessToken)) {
            log.info("WhatsApp Cloud API credentials not configured. Falling back to wa.me deep link.");
            return deepLinkService.sendOrPrepareReceipt(order, receiptUrl);
        }

        try {
            RestClient restClient = RestClient.builder()
                    .baseUrl(whatsAppProperties.getCloudApi().getApiUrl())
                    .defaultHeader("Authorization", "Bearer " + accessToken)
                    .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                    .build();

            String cleanPhone = order.getCustomerPhone().replaceAll("[^0-9]", "");

            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp",
                    "recipient_type", "individual",
                    "to", cleanPhone,
                    "type", "text",
                    "text", Map.of(
                            "preview_url", true,
                            "body", String.format(
                                    "Hello %s! Your catering order #%s with %s is confirmed. Total: %s%.2f. View receipt: %s",
                                    order.getCustomerName(),
                                    order.getOrderNumber(),
                                    cateringProperties.getName(),
                                    cateringProperties.getCurrency(),
                                    order.getTotalAmount(),
                                    receiptUrl
                            )
                    )
            );

            restClient.post()
                    .uri("/{phoneNumberId}/messages", phoneNumberId)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Direct WhatsApp Cloud API message sent successfully to {}", cleanPhone);

            return WhatsAppShareResponse.builder()
                    .orderNumber(order.getOrderNumber())
                    .recipientPhone(order.getCustomerPhone())
                    .shareUrl(null)
                    .messagePreview("Sent directly via WhatsApp Cloud API")
                    .receiptVerificationToken(null)
                    .sentDirectlyViaCloudApi(true)
                    .build();

        } catch (Exception e) {
            log.warn("Error calling WhatsApp Cloud API: {}. Falling back to wa.me deep link.", e.getMessage());
            return deepLinkService.sendOrPrepareReceipt(order, receiptUrl);
        }
    }

    @Override
    public String getProviderName() {
        return "cloudapi";
    }
}

