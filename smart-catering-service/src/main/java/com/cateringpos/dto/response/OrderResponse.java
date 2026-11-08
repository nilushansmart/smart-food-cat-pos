package com.cateringpos.dto.response;

import com.cateringpos.enums.OrderStatus;
import com.cateringpos.enums.OrderType;
import com.cateringpos.enums.PaymentMethod;
import com.cateringpos.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private OrderType orderType;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;

    private LocalDate eventDate;
    private String eventTime;
    private String eventType;
    private String guestCount;

    private String deliveryAddress;
    private BigDecimal deliveryLatitude;
    private BigDecimal deliveryLongitude;
    private BigDecimal deliveryDistanceKm;
    private String estimatedDeliveryTime;

    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;

    private String notes;
    private Long createdByUserId;
    private String createdByUsername;
    private String branchId;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    private List<OrderItemResponse> items;
}

