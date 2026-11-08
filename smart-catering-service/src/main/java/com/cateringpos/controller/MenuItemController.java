package com.cateringpos.controller;

import com.cateringpos.dto.ApiResponse;
import com.cateringpos.dto.request.MenuItemRequest;
import com.cateringpos.dto.response.MenuItemResponse;
import com.cateringpos.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
@Tag(name = "Menu Items", description = "Endpoints for catering dishes, party trays, and menu item management")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping
    @Operation(summary = "Browse available catering menu items with category and text filters (Public)")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAvailableMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        List<MenuItemResponse> items = menuItemService.getAvailableMenuItems(categoryId, search);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all menu items including unavailable items (Admin only)")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAllMenuItemsAdmin() {
        List<MenuItemResponse> items = menuItemService.getAllMenuItemsAdmin();
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponse item = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new catering menu item (Admin only)")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse created = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Menu item created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing menu item (Admin only)")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request
    ) {
        MenuItemResponse updated = menuItemService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated successfully", updated));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Toggle menu item in-stock / available status")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggleAvailability(@PathVariable Long id) {
        MenuItemResponse updated = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok("Availability updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a menu item (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu item deleted successfully", null));
    }
}

