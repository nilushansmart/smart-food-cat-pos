package com.cateringpos.service;

import com.cateringpos.dto.request.MenuItemRequest;
import com.cateringpos.dto.response.MenuItemResponse;

import java.util.List;

/**
 * Service interface for catering menu items.
 */
public interface MenuItemService {

    List<MenuItemResponse> getAvailableMenuItems(Long categoryId, String search);

    List<MenuItemResponse> getAllMenuItemsAdmin();

    MenuItemResponse getMenuItemById(Long id);

    MenuItemResponse createMenuItem(MenuItemRequest request);

    MenuItemResponse updateMenuItem(Long id, MenuItemRequest request);

    MenuItemResponse toggleAvailability(Long id);

    void deleteMenuItem(Long id);
}

