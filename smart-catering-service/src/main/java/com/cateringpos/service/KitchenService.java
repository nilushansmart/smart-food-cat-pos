package com.cateringpos.service;

import com.cateringpos.dto.response.KitchenTicketResponse;
import com.cateringpos.enums.OrderStatus;

import java.util.List;

/**
 * Service interface for kitchen display system (KDS) operations.
 */
public interface KitchenService {

    /**
     * Retrieves all active catering tickets (PENDING, PREPARING, READY) ordered chronologically.
     */
    List<KitchenTicketResponse> getActiveKitchenTickets();

    /**
     * Transitions an order between preparation stages.
     */
    KitchenTicketResponse updateTicketStatus(Long id, OrderStatus newStatus);
}

