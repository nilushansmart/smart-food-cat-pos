package com.cateringpos.mapper;

import com.cateringpos.dto.request.MenuItemRequest;
import com.cateringpos.dto.response.MenuItemResponse;
import com.cateringpos.entity.Category;
import com.cateringpos.entity.MenuItem;
import org.springframework.stereotype.Component;

@Component
public class MenuItemMapper {

    public MenuItemResponse toResponse(MenuItem menuItem) {
        if (menuItem == null) {
            return null;
        }

        Long categoryId = menuItem.getCategory() != null ? menuItem.getCategory().getId() : null;
        String categoryName = menuItem.getCategory() != null ? menuItem.getCategory().getName() : null;

        return MenuItemResponse.builder()
                .id(menuItem.getId())
                .categoryId(categoryId)
                .categoryName(categoryName)
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .imageUrl(menuItem.getImageUrl())
                .prepTimeMinutes(menuItem.getPrepTimeMinutes())
                .pax(menuItem.getPax())
                .available(menuItem.isAvailable())
                .branchId(menuItem.getBranchId())
                .createdAt(menuItem.getCreatedAt())
                .build();
    }

    public MenuItem toEntity(MenuItemRequest request, Category category) {
        if (request == null) {
            return null;
        }

        return MenuItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .prepTimeMinutes(request.getPrepTimeMinutes() != null ? request.getPrepTimeMinutes() : 20)
                .pax(request.getPax())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .branchId(request.getBranchId() != null ? request.getBranchId() : "MAIN")
                .build();
    }
}

