package com.cateringpos.repository;

import com.cateringpos.entity.Order;
import com.cateringpos.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.menuItem", "items.menuItem.category"})
    Optional<Order> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"items", "items.menuItem", "items.menuItem.category"})
    Optional<Order> findWithItemsById(Long id);

    Page<Order> findByCreatedByIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.menuItem"})
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    @Query("SELECT DISTINCT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:dateFrom IS NULL OR o.createdAt >= :dateFrom) AND " +
           "(:dateTo IS NULL OR o.createdAt <= :dateTo) AND " +
           "(:branchId IS NULL OR o.branchId = :branchId) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> findFilteredOrders(
            @Param("status") OrderStatus status,
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            @Param("branchId") String branchId,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0), COUNT(o) FROM Order o " +
           "WHERE o.status = 'COMPLETED' AND o.createdAt >= :startOfDay AND o.createdAt <= :endOfDay")
    List<Object[]> getDailyIncomeSummary(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt <= :endOfDay ORDER BY o.createdAt DESC")
    List<Order> findOrdersByDate(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0), COUNT(o) FROM Order o " +
           "WHERE o.status = 'COMPLETED' AND o.createdAt >= :startOfMonth AND o.createdAt <= :endOfMonth")
    List<Object[]> getMonthlyIncomeSummary(
            @Param("startOfMonth") LocalDateTime startOfMonth,
            @Param("endOfMonth") LocalDateTime endOfMonth
    );

    @Query("SELECT c.name, COUNT(DISTINCT o.id), COALESCE(SUM(i.subtotal), 0) " +
           "FROM OrderItem i JOIN i.order o JOIN i.menuItem m JOIN m.category c " +
           "WHERE o.status = 'COMPLETED' AND o.createdAt >= :startOfMonth AND o.createdAt <= :endOfMonth " +
           "GROUP BY c.id, c.name")
    List<Object[]> getMonthlyCategoryBreakdown(
            @Param("startOfMonth") LocalDateTime startOfMonth,
            @Param("endOfMonth") LocalDateTime endOfMonth
    );

    @Query("SELECT i.itemName, c.name, SUM(i.quantity), COALESCE(SUM(i.subtotal), 0) " +
           "FROM OrderItem i JOIN i.order o JOIN i.menuItem m JOIN m.category c " +
           "WHERE o.status = 'COMPLETED' AND o.createdAt >= :startOfMonth AND o.createdAt <= :endOfMonth " +
           "GROUP BY i.itemName, c.name " +
           "ORDER BY SUM(i.quantity) DESC")
    List<Object[]> getMonthlyTopSellingItems(
            @Param("startOfMonth") LocalDateTime startOfMonth,
            @Param("endOfMonth") LocalDateTime endOfMonth
    );

    long countByStatus(OrderStatus status);
}
