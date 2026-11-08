package com.cateringpos.controller;

import com.cateringpos.exception.UnauthorizedException;
import com.cateringpos.service.ReceiptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
@Tag(name = "Receipts", description = "Endpoints for viewing and downloading OpenPDF digital receipts with signed token security")
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping("/{orderId}/view")
    @Operation(summary = "View digital receipt inline in browser (supports signed token or user login)")
    public ResponseEntity<byte[]> viewReceipt(
            @PathVariable Long orderId,
            @RequestParam(required = false) String token,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : null;

        if (!receiptService.validateReceiptAccess(orderId, token, username)) {
            throw new UnauthorizedException("Invalid or expired receipt access token");
        }

        byte[] pdfBytes = receiptService.generateReceiptPdf(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "receipt-order-" + orderId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/{orderId}/download")
    @Operation(summary = "Download digital PDF receipt as an attachment (supports signed token or user login)")
    public ResponseEntity<byte[]> downloadReceipt(
            @PathVariable Long orderId,
            @RequestParam(required = false) String token,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : null;

        if (!receiptService.validateReceiptAccess(orderId, token, username)) {
            throw new UnauthorizedException("Invalid or expired receipt access token");
        }

        byte[] pdfBytes = receiptService.generateReceiptPdf(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"receipt-order-" + orderId + ".pdf\"");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}

