package com.cateringpos.controller;

import com.cateringpos.dto.ApiResponse;
import com.cateringpos.dto.request.UpdateOrderStatusRequest;
import com.cateringpos.dto.response.KitchenTicketResponse;
import com.cateringpos.service.KitchenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'KITCHEN')")
@Tag(name = "Kitchen Display System (KDS)", description = "Real-time kitchen order preparation tickets and status updates")
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/tickets")
    @Operation(summary = "Get active kitchen tickets sorted chronologically with urgency metrics")
    public ResponseEntity<ApiResponse<List<KitchenTicketResponse>>> getActiveTickets() {
        List<KitchenTicketResponse> tickets = kitchenService.getActiveKitchenTickets();
        return ResponseEntity.ok(ApiResponse.ok(tickets));
    }

    @PatchMapping("/tickets/{id}/status")
    @Operation(summary = "Update ticket preparation status (PENDING -> PREPARING -> READY -> COMPLETED)")
    public ResponseEntity<ApiResponse<KitchenTicketResponse>> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        KitchenTicketResponse ticket = kitchenService.updateTicketStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Kitchen ticket status updated", ticket));
    }
}

