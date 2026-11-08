package com.cateringpos.controller;

import com.cateringpos.dto.request.CreateOrderRequest;
import com.cateringpos.dto.request.OrderItemRequest;
import com.cateringpos.dto.response.OrderResponse;
import com.cateringpos.dto.response.WhatsAppShareResponse;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.enums.OrderType;
import com.cateringpos.enums.PaymentMethod;
import com.cateringpos.enums.PaymentStatus;
import com.cateringpos.security.JwtAuthenticationEntryPoint;
import com.cateringpos.security.JwtAuthenticationFilter;
import com.cateringpos.security.JwtUtil;
import com.cateringpos.security.UserDetailsServiceImpl;
import com.cateringpos.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @DisplayName("POST /api/orders should successfully create an order and return 201 Created")
    void testCreateOrderEndpoint() throws Exception {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Grand Hotel")
                .customerPhone("+15554443322")
                .orderType(OrderType.ONLINE_DELIVERY)
                .eventDate(LocalDate.now().plusDays(5))
                .eventTime("19:00")
                .eventType("Wedding Reception")
                .guestCount("150 Guests")
                .deliveryAddress("456 Grand Ave")
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .items(List.of(new OrderItemRequest(1L, 5, "Gluten-free preference")))
                .build();

        OrderResponse response = OrderResponse.builder()
                .id(99L)
                .orderNumber("ORD-20261108-999")
                .customerName("Grand Hotel")
                .customerPhone("+15554443322")
                .orderType(OrderType.ONLINE_DELIVERY)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .subtotal(new BigDecimal("600.00"))
                .taxAmount(new BigDecimal("30.00"))
                .totalAmount(new BigDecimal("630.00"))
                .build();

        when(orderService.createOrder(any(CreateOrderRequest.class), any())).thenReturn(response);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("ORD-20261108-999"))
                .andExpect(jsonPath("$.data.totalAmount").value(630.00));
    }

    @Test
    @DisplayName("GET /api/orders/{id} should return order details")
    void testGetOrderByIdEndpoint() throws Exception {
        OrderResponse response = OrderResponse.builder()
                .id(42L)
                .orderNumber("ORD-20261108-042")
                .customerName("Sarah Connor")
                .totalAmount(new BigDecimal("150.00"))
                .status(OrderStatus.PREPARING)
                .build();

        when(orderService.getOrderById(42L)).thenReturn(response);

        mockMvc.perform(get("/api/orders/42"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("ORD-20261108-042"))
                .andExpect(jsonPath("$.data.status").value("PREPARING"));
    }

    @Test
    @DisplayName("POST /api/orders/{id}/send-receipt should generate WhatsApp payload")
    void testSendReceiptEndpoint() throws Exception {
        WhatsAppShareResponse waResponse = WhatsAppShareResponse.builder()
                .orderNumber("ORD-20261108-042")
                .recipientPhone("+15550001122")
                .shareUrl("https://wa.me/15550001122?text=OrderConfirmed")
                .build();

        when(orderService.prepareWhatsAppReceipt(eq(42L))).thenReturn(waResponse);

        mockMvc.perform(post("/api/orders/42/send-receipt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.shareUrl").value("https://wa.me/15550001122?text=OrderConfirmed"));
    }
}

