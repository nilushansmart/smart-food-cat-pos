package com.cateringpos.service.impl;

import com.cateringpos.config.CateringProperties;
import com.cateringpos.config.WhatsAppProperties;
import com.cateringpos.dto.request.CreateOrderRequest;
import com.cateringpos.dto.request.OrderItemRequest;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.entity.MenuItem;
import com.cateringpos.entity.Order;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.enums.OrderType;
import com.cateringpos.enums.PaymentMethod;
import com.cateringpos.enums.PaymentStatus;
import com.cateringpos.exception.BadRequestException;
import com.cateringpos.mapper.OrderMapper;
import com.cateringpos.repository.MenuItemRepository;
import com.cateringpos.repository.OrderRepository;
import com.cateringpos.repository.UserRepository;
import com.cateringpos.service.GoogleMapsService;
import com.cateringpos.service.ReceiptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private CateringProperties cateringProperties;

    @Mock
    private WhatsAppProperties whatsAppProperties;

    @Mock
    private ReceiptService receiptService;

    @Mock
    private GoogleMapsService googleMapsService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private MenuItem biryani;
    private MenuItem springRolls;

    @BeforeEach
    void setUp() {
        biryani = MenuItem.builder()
                .id(101L)
                .name("Hyderabadi Chicken Biryani Tray")
                .price(new BigDecimal("120.00"))
                .available(true)
                .build();

        springRolls = MenuItem.builder()
                .id(102L)
                .name("Crispy Veg Spring Rolls (25 pcs)")
                .price(new BigDecimal("35.00"))
                .available(true)
                .build();
    }

    @Test
    @DisplayName("createOrder() should accurately compute subtotal, 5% tax, and total on server")
    void testCreateOrderFinancialCalculations() {
        when(cateringProperties.getTaxRate()).thenReturn(new BigDecimal("0.05"));

        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Alice Smith")
                .customerPhone("+15559876543")
                .orderType(OrderType.ONLINE_DELIVERY)
                .eventDate(LocalDate.now().plusDays(2))
                .eventTime("18:30")
                .eventType("Corporate Gala")
                .guestCount("50-60 Guests")
                .deliveryAddress("123 Banquet St, Downtown")
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .items(List.of(
                        new OrderItemRequest(101L, 2, "Extra raita"),    // 2 * 120 = 240
                        new OrderItemRequest(102L, 1, "Sweet chili dip") // 1 * 35 = 35
                ))
                .build();

        when(menuItemRepository.findById(101L)).thenReturn(Optional.of(biryani));
        when(menuItemRepository.findById(102L)).thenReturn(Optional.of(springRolls));

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(500L);
            return saved;
        });

        OrderResponse expectedResponse = OrderResponse.builder()
                .id(500L)
                .orderNumber("ORD-SAMPLE")
                .subtotal(new BigDecimal("275.00"))
                .taxAmount(new BigDecimal("13.75"))
                .totalAmount(new BigDecimal("288.75"))
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        when(orderMapper.toResponse(any(Order.class))).thenReturn(expectedResponse);

        OrderResponse response = orderService.createOrder(request, "alice_user");

        assertThat(response).isNotNull();
        assertThat(response.getSubtotal()).isEqualByComparingTo("275.00");
        assertThat(response.getTaxAmount()).isEqualByComparingTo("13.75");
        assertThat(response.getTotalAmount()).isEqualByComparingTo("288.75");

        verify(orderRepository).save(argThat(order ->
                order.getSubtotal().compareTo(new BigDecimal("275.00")) == 0 &&
                order.getTaxAmount().compareTo(new BigDecimal("13.75")) == 0 &&
                order.getTotalAmount().compareTo(new BigDecimal("288.75")) == 0 &&
                order.getStatus() == OrderStatus.PENDING
        ));
    }

    @Test
    @DisplayName("createOrder() should reject empty item list")
    void testCreateOrderEmptyItems() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Bob")
                .customerPhone("5551234")
                .items(Collections.emptyList())
                .build();

        assertThatThrownBy(() -> orderService.createOrder(request, "bob"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("must contain at least one catering item");
    }

    @Test
    @DisplayName("createOrder() should reject unavailable items")
    void testCreateOrderUnavailableItem() {
        biryani.setAvailable(false);
        when(menuItemRepository.findById(101L)).thenReturn(Optional.of(biryani));

        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Bob")
                .customerPhone("5551234")
                .items(List.of(new OrderItemRequest(101L, 1, null)))
                .build();

        assertThatThrownBy(() -> orderService.createOrder(request, "bob"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("currently unavailable");
    }
}

