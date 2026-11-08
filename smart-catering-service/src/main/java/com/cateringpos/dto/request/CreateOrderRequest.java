package com.cateringpos.dto.request;

import com.cateringpos.enums.OrderType;
import com.cateringpos.enums.PaymentMethod;
import com.cateringpos.enums.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotNull(message = "Order type is required")
    @Builder.Default
    private OrderType orderType = OrderType.ONLINE_DELIVERY;

    private LocalDate eventDate;

    private String eventTime;

    private String eventType;

    private String guestCount;

    private String deliveryAddress;

    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;

    private String notes;

    @Builder.Default
    private String branchId = "MAIN";

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}
