package com.cateringpos.repository;

import com.cateringpos.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByAvailableTrue();

    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);

    @Query("SELECT m FROM MenuItem m WHERE m.available = true AND " +
            "(LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<MenuItem> searchAvailable(@Param("query") String query);

    Page<MenuItem> findByCategoryId(Long categoryId, Pageable pageable);
}
