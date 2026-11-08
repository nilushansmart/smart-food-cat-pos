package com.cateringpos.service;

import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.entity.Order;

/**
 * Service interface for delivering or sharing receipts over WhatsApp.
 * Implementations include deep-link generator and WhatsApp Business Cloud API.
 */
public interface WhatsAppService {

    /**
     * Prepares or sends the receipt to the customer via WhatsApp.
     *
     * @param order the catering order
     * @param receiptUrl absolute signed URL to view the PDF receipt
     * @return response containing deep-link URL or delivery status
     */
    WhatsAppShareResponse sendOrPrepareReceipt(Order order, String receiptUrl);

    /**
     * Unique identifier for the provider (e.g. "deeplink", "cloudapi").
     */
    String getProviderName();
}

