package com.cateringpos.service.impl;

import com.cateringpos.config.CateringProperties;
import com.cateringpos.config.WhatsAppProperties;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.entity.Order;
import com.cateringpos.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service("deeplink")
@RequiredArgsConstructor
public class WhatsAppDeepLinkServiceImpl implements WhatsAppService {

    private final CateringProperties cateringProperties;
    private final WhatsAppProperties whatsAppProperties;

    @Override
    public WhatsAppShareResponse sendOrPrepareReceipt(Order order, String receiptUrl) {
        String cleanPhone = cleanPhoneNumber(order.getCustomerPhone());

        String message = String.format(
                "Hello %s! 👋\n\n" +
                "Thank you for ordering with *%s*.\n\n" +
                "📋 *Order Number:* %s\n" +
                "📅 *Event Date:* %s %s\n" +
                "👥 *Guest Count:* %s\n" +
                "💵 *Total Amount:* %s%.2f\n" +
                "🚚 *Type:* %s\n\n" +
                "📄 You can view and download your official digital catering receipt here:\n%s\n\n" +
                "We look forward to serving your event! 🍽️✨",
                order.getCustomerName(),
                cateringProperties.getName(),
                order.getOrderNumber(),
                order.getEventDate() != null ? order.getEventDate().toString() : "TBD",
                order.getEventTime() != null ? order.getEventTime() : "",
                order.getGuestCount() != null ? order.getGuestCount() : "N/A",
                cateringProperties.getCurrency(),
                order.getTotalAmount(),
                order.getOrderType().name().replace("_", " "),
                receiptUrl
        );

        String encodedText = URLEncoder.encode(message, StandardCharsets.UTF_8);
        String deepLinkBase = whatsAppProperties.getDeepLink().getBaseUrl();
        if (!deepLinkBase.endsWith("/")) {
            deepLinkBase += "/";
        }
        String shareUrl = deepLinkBase + cleanPhone + "?text=" + encodedText;

        return WhatsAppShareResponse.builder()
                .orderNumber(order.getOrderNumber())
                .recipientPhone(order.getCustomerPhone())
                .shareUrl(shareUrl)
                .messagePreview(message)
                .receiptVerificationToken(null)
                .sentDirectlyViaCloudApi(false)
                .build();
    }

    @Override
    public String getProviderName() {
        return "deeplink";
    }

    private String cleanPhoneNumber(String phone) {
        if (phone == null) {
            return "";
        }
        // Remove spaces, dashes, brackets; preserve digits
        return phone.replaceAll("[^0-9]", "");
    }
}

