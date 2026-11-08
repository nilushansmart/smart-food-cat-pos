package com.cateringpos.service;

import com.cateringpos.dto.request.CategoryRequest;
import com.cateringpos.dto.response.CategoryResponse;

import java.util.List;

/**
 * Service interface for food category management.
 */
public interface CategoryService {

    List<CategoryResponse> getAllActiveCategories();

    List<CategoryResponse> getAllCategoriesAdmin();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);
}

