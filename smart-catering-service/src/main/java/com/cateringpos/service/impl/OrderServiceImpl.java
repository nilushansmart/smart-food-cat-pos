package com.cateringpos.service.impl;

import com.cateringpos.config.CateringProperties;
import com.cateringpos.config.WhatsAppProperties;
import com.cateringpos.dto.request.CreateOrderRequest;
import com.cateringpos.dto.request.OrderItemRequest;
import com.cateringpos.dto.request.UpdateOrderStatusRequest;
import com.cateringpos.dto.response.DistanceMatrixResponse;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.entity.MenuItem;
import com.cateringpos.entity.Order;
import com.cateringpos.entity.OrderItem;
import com.cateringpos.entity.User;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.enums.OrderType;
import com.cateringpos.enums.PaymentMethod;
import com.cateringpos.enums.PaymentStatus;
import com.cateringpos.exception.BadRequestException;
import com.cateringpos.exception.ResourceNotFoundException;
import com.cateringpos.mapper.OrderMapper;
import com.cateringpos.repository.MenuItemRepository;
import com.cateringpos.repository.OrderRepository;
import com.cateringpos.repository.UserRepository;
import com.cateringpos.service.GoogleMapsService;
import com.cateringpos.service.OrderService;
import com.cateringpos.service.ReceiptService;
import com.cateringpos.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final CateringProperties cateringProperties;
    private final WhatsAppProperties whatsAppProperties;
    private final Map<String, WhatsAppService> whatsAppServices;
    private final ReceiptService receiptService;
    private final GoogleMapsService googleMapsService;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String currentUsername) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one catering item");
        }

        User createdBy = null;
        if (StringUtils.hasText(currentUsername)) {
            createdBy = userRepository.findByUsername(currentUsername).orElse(null);
        }

        // Build order entity
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customerName(request.getCustomerName().trim())
                .customerPhone(request.getCustomerPhone().trim())
                .orderType(request.getOrderType() != null ? request.getOrderType() : OrderType.ONLINE_DELIVERY)
                .status(OrderStatus.PENDING)
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CASH_ON_DELIVERY)
                .eventDate(request.getEventDate() != null ? request.getEventDate() : LocalDate.now())
                .eventTime(request.getEventTime())
                .eventType(request.getEventType())
                .guestCount(request.getGuestCount())
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .createdBy(createdBy)
                .branchId(request.getBranchId() != null ? request.getBranchId() : "MAIN")
                .items(new ArrayList<>())
                .build();

        // Server-side calculation of line items and subtotal (never trust client amounts!)
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemReq.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new BadRequestException("Menu item '" + menuItem.getName() + "' is currently unavailable");
            }

            int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(qty));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .itemName(menuItem.getName())
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .subtotal(itemSubtotal)
                    .specialNote(itemReq.getSpecialNote())
                    .build();

            order.addItem(orderItem);
            subtotal = subtotal.add(itemSubtotal);
        }

        BigDecimal taxRate = cateringProperties.getTaxRate() != null ? cateringProperties.getTaxRate() : new BigDecimal("0.05");
        BigDecimal taxAmount = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        order.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);

        // Google Maps integration for delivery address ETA & Distance
        if (order.getOrderType() == OrderType.ONLINE_DELIVERY && StringUtils.hasText(order.getDeliveryAddress())) {
            try {
                DistanceMatrixResponse distanceMatrix = googleMapsService.calculateDistanceAndEta(order.getDeliveryAddress());
                if (distanceMatrix != null) {
                    order.setDeliveryDistanceKm(distanceMatrix.getDistanceKm());
                    order.setEstimatedDeliveryTime(distanceMatrix.getDurationText());
                }
            } catch (Exception e) {
                log.warn("Failed to calculate distance for delivery address '{}': {}", order.getDeliveryAddress(), e.getMessage());
            }
        }

        order = orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findWithItemsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(LocalDate date, OrderStatus status, String branchId, Pageable pageable) {
        LocalDateTime dateFrom = date != null ? date.atStartOfDay() : null;
        LocalDateTime dateTo = date != null ? date.atTime(23, 59, 59, 999999999) : null;
        Page<Order> ordersPage = orderRepository.findFilteredOrders(status, dateFrom, dateTo, branchId, pageable);
        return ordersPage.map(orderMapper::toResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // Validate state transitions
        if (currentStatus == OrderStatus.COMPLETED || currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot update an order that is already " + currentStatus);
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            if (order.getPaymentStatus() == PaymentStatus.PENDING) {
                order.setPaymentStatus(PaymentStatus.PAID);
            }
        }

        order = orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public WhatsAppShareResponse prepareWhatsAppReceipt(Long orderId) {
        Order order = orderRepository.findWithItemsById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String signedToken = receiptService.generateSignedReceiptToken(orderId);
        String receiptUrl = String.format("/api/receipts/%d/view?token=%s", orderId, signedToken);

        String providerName = whatsAppProperties.getDefaultProvider();
        WhatsAppService whatsAppService = whatsAppServices.get(providerName);
        if (whatsAppService == null) {
            whatsAppService = whatsAppServices.get("deeplink");
        }

        return whatsAppService.sendOrPrepareReceipt(order, receiptUrl);
    }

    private String generateOrderNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomSeq = ThreadLocalRandom.current().nextInt(100, 999);
        return String.format("ORD-%s-%03d", dateStr, randomSeq);
    }
}
