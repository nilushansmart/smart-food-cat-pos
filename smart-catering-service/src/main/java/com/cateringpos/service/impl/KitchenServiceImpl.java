package com.cateringpos.service.impl;

import com.cateringpos.dto.response.KitchenTicketResponse;
import com.cateringpos.entity.Order;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.exception.BadRequestException;
import com.cateringpos.exception.ResourceNotFoundException;
import com.cateringpos.mapper.OrderMapper;
import com.cateringpos.repository.OrderRepository;
import com.cateringpos.service.KitchenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KitchenServiceImpl implements KitchenService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional(readOnly = true)
    public List<KitchenTicketResponse> getActiveKitchenTickets() {
        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PENDING,
                OrderStatus.PREPARING,
                OrderStatus.READY
        );

        List<Order> activeOrders = orderRepository.findByStatusInOrderByCreatedAtAsc(activeStatuses);

        return activeOrders.stream()
                .map(orderMapper::toKitchenTicket)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KitchenTicketResponse updateTicketStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findWithItemsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kitchen ticket / Order", "id", id));

        if (newStatus == null) {
            throw new BadRequestException("New order status cannot be null");
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
        }

        order = orderRepository.save(order);
        return orderMapper.toKitchenTicket(order);
    }
}

