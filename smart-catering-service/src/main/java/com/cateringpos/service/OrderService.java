package com.cateringpos.service;

import com.cateringpos.dto.request.CreateOrderRequest;
import com.cateringpos.dto.request.UpdateOrderStatusRequest;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

/**
 * Service interface for catering orders and event bookings.
 */
public interface OrderService {

    /**
     * Creates a new catering order with server-calculated totals.
     */
    OrderResponse createOrder(CreateOrderRequest request, String currentUsername);

    /**
     * Retrieves an order by primary key with its line items.
     */
    OrderResponse getOrderById(Long id);

    /**
     * Retrieves an order by unique order number (e.g. ORD-20261108-001).
     */
    OrderResponse getOrderByNumber(String orderNumber);

    /**
     * Paginated and filtered search of orders.
     */
    Page<OrderResponse> getOrders(LocalDate date, OrderStatus status, String branchId, Pageable pageable);

    /**
     * Updates an order status following the lifecycle: PENDING -> PREPARING -> READY -> COMPLETED.
     */
    OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request);

    /**
     * Generates a signed receipt link and prepares the WhatsApp message / delivery.
     */
    WhatsAppShareResponse prepareWhatsAppReceipt(Long orderId);
}

