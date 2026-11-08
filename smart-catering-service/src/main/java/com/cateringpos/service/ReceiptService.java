package com.cateringpos.service;

/**
 * Service interface for generating PDF receipts and validating receipt access.
 */
public interface ReceiptService {

    /**
     * Generates a branded OpenPDF receipt byte array for an order.
     */
    byte[] generateReceiptPdf(Long orderId);

    /**
     * Generates a signed, expiring cryptographic token granting access to view/download this receipt.
     */
    String generateSignedReceiptToken(Long orderId);

    /**
     * Validates whether a requester can access this receipt via signed token or authenticated identity.
     */
    boolean validateReceiptAccess(Long orderId, String signedToken, String username);
}

