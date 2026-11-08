package com.cateringpos.controller;

import com.cateringpos.dto.ApiResponse;
import com.cateringpos.dto.request.CreateOrderRequest;
import com.cateringpos.dto.request.UpdateOrderStatusRequest;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Endpoints for placing catering orders, tracking status, and sharing receipts")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new catering order or event booking")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        OrderResponse createdOrder = orderService.createOrder(request, username);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", createdOrder));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "List and search orders with pagination and filters (Admin/Staff)")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String branchId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        Page<OrderResponse> page = orderService.getOrders(date, status, branchId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by internal ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order details by public order number (tracking)")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'KITCHEN')")
    @Operation(summary = "Update order status (PENDING -> PREPARING -> READY -> COMPLETED / CANCELLED)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
    }

    @PostMapping("/{id}/send-receipt")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Generate signed receipt token and prepare WhatsApp delivery (Admin/Staff)")
    public ResponseEntity<ApiResponse<WhatsAppShareResponse>> sendReceipt(@PathVariable Long id) {
        WhatsAppShareResponse response = orderService.prepareWhatsAppReceipt(id);
        return ResponseEntity.ok(ApiResponse.ok("Receipt prepared for WhatsApp", response));
    }
}

