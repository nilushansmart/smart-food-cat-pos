package com.cateringpos.service.impl;

import com.cateringpos.dto.request.MenuItemRequest;
import com.cateringpos.dto.response.MenuItemResponse;
import com.cateringpos.entity.Category;
import com.cateringpos.entity.MenuItem;
import com.cateringpos.exception.ResourceNotFoundException;
import com.cateringpos.mapper.MenuItemMapper;
import com.cateringpos.repository.CategoryRepository;
import com.cateringpos.repository.MenuItemRepository;
import com.cateringpos.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemMapper menuItemMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAvailableMenuItems(Long categoryId, String search) {
        List<MenuItem> items;

        if (categoryId != null && categoryId > 0) {
            items = menuItemRepository.findByCategoryIdAndAvailableTrue(categoryId);
            if (StringUtils.hasText(search)) {
                String term = search.toLowerCase();
                items = items.stream()
                        .filter(i -> i.getName().toLowerCase().contains(term)
                                || (i.getDescription() != null && i.getDescription().toLowerCase().contains(term)))
                        .collect(Collectors.toList());
            }
        } else if (StringUtils.hasText(search)) {
            items = menuItemRepository.searchAvailable(search.trim());
        } else {
            items = menuItemRepository.findByAvailableTrue();
        }

        return items.stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllMenuItemsAdmin() {
        return menuItemRepository.findAll().stream()
                .map(menuItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        MenuItem item = menuItemMapper.toEntity(request, category);
        item = menuItemRepository.save(item);
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        if (request.getPrepTimeMinutes() != null) {
            item.setPrepTimeMinutes(request.getPrepTimeMinutes());
        }
        item.setPax(request.getPax());
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }
        if (StringUtils.hasText(request.getBranchId())) {
            item.setBranchId(request.getBranchId());
        }

        item = menuItemRepository.save(item);
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        item.setAvailable(!item.isAvailable());
        item = menuItemRepository.save(item);
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem", "id", id);
        }
        menuItemRepository.deleteById(id);
    }
}

