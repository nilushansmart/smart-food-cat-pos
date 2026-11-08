package com.cateringpos.dto.response;

import com.cateringpos.enums.OrderStatus;
import com.cateringpos.enums.OrderType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KitchenTicketResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private OrderType orderType;
    private OrderStatus status;

    private LocalDate eventDate;
    private String eventTime;
    private String eventType;
    private String guestCount;
    private String deliveryAddress;

    private LocalDateTime createdAt;
    private long elapsedMinutes;
    private String urgency; // "NORMAL" (<10m), "WARNING" (10-20m), "URGENT" (>20m)

    private List<OrderItemResponse> items;
}

