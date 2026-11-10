package com.cateringpos.mapper;

import com.cateringpos.dto.response.KitchenTicketResponse;
import com.cateringpos.dto.response.OrderItemResponse;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.entity.Order;
import com.cateringpos.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList())
                : Collections.emptyList();

        Long createdByUserId = order.getCreatedBy() != null ? order.getCreatedBy().getId() : null;
        String createdByUsername = order.getCreatedBy() != null ? order.getCreatedBy().getUsername() : null;

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .orderType(order.getOrderType())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .eventDate(order.getEventDate())
                .eventTime(order.getEventTime())
                .eventType(order.getEventType())
                .guestCount(order.getGuestCount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryLatitude(order.getDeliveryLatitude())
                .deliveryLongitude(order.getDeliveryLongitude())
                .deliveryDistanceKm(order.getDeliveryDistanceKm())
                .estimatedDeliveryTime(order.getEstimatedDeliveryTime())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .createdByUserId(createdByUserId)
                .createdByUsername(createdByUsername)
                .branchId(order.getBranchId())
                .createdAt(order.getCreatedAt())
                .completedAt(order.getCompletedAt())
                .items(itemResponses)
                .build();
    }

    public OrderItemResponse toItemResponse(OrderItem item) {
        if (item == null) {
            return null;
        }

        Long menuItemId = item.getMenuItem() != null ? item.getMenuItem().getId() : null;

        return OrderItemResponse.builder()
                .id(item.getId())
                .menuItemId(menuItemId)
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .specialNote(item.getSpecialNote())
                .build();
    }

    public KitchenTicketResponse toKitchenTicket(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(this::toItemResponse).collect(Collectors.toList())
                : Collections.emptyList();

        long elapsedMinutes = 0;
        if (order.getCreatedAt() != null) {
            elapsedMinutes = Duration.between(order.getCreatedAt(), LocalDateTime.now()).toMinutes();
        }

        String urgency;
        if (elapsedMinutes < 15) {
            urgency = "NORMAL";
        } else if (elapsedMinutes < 30) {
            urgency = "WARNING";
        } else {
            urgency = "URGENT";
        }

        return KitchenTicketResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .orderType(order.getOrderType())
                .status(order.getStatus())
                .eventDate(order.getEventDate())
                .eventTime(order.getEventTime())
                .eventType(order.getEventType())
                .guestCount(order.getGuestCount())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .elapsedMinutes(elapsedMinutes)
                .urgency(urgency)
                .items(itemResponses)
                .build();
    }
}
