package com.cateringpos.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhatsAppShareResponse {

    private String orderNumber;
    private String recipientPhone;
    private String shareUrl; // wa.me deep link
    private String messagePreview;
    private String receiptVerificationToken;
    private boolean sentDirectlyViaCloudApi;
}

