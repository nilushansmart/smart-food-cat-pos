package com.cateringpos.service.impl;

import com.cateringpos.dto.response.*;
import com.cateringpos.entity.Order;
import com.cateringpos.enums.OrderStatus;
import com.cateringpos.mapper.OrderMapper;
import com.cateringpos.repository.OrderRepository;
import com.cateringpos.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional(readOnly = true)
    public DailyIncomeReportResponse getDailyIncomeReport(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);

        List<Order> ordersForDay = orderRepository.findOrdersByDate(startOfDay, endOfDay);

        BigDecimal totalIncome = BigDecimal.ZERO;
        long completedCount = 0;
        long pendingCount = 0;
        long cancelledCount = 0;

        for (Order order : ordersForDay) {
            if (order.getStatus() == OrderStatus.COMPLETED) {
                totalIncome = totalIncome.add(order.getTotalAmount());
                completedCount++;
            } else if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.PREPARING || order.getStatus() == OrderStatus.READY) {
                pendingCount++;
            } else if (order.getStatus() == OrderStatus.CANCELLED) {
                cancelledCount++;
            }
        }

        BigDecimal averageOrderValue = completedCount > 0
                ? totalIncome.divide(BigDecimal.valueOf(completedCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<OrderResponse> orderResponses = ordersForDay.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());

        return DailyIncomeReportResponse.builder()
                .date(date)
                .totalIncome(totalIncome.setScale(2, RoundingMode.HALF_UP))
                .totalOrders(ordersForDay.size())
                .completedOrders(completedCount)
                .pendingOrders(pendingCount)
                .cancelledOrders(cancelledCount)
                .averageOrderValue(averageOrderValue)
                .orders(orderResponses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlyAnalyticsResponse getMonthlyAnalytics(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59, 999999999);

        // Overall monthly summary
        List<Object[]> summary = orderRepository.getMonthlyIncomeSummary(startOfMonth, endOfMonth);
        BigDecimal totalIncome = BigDecimal.ZERO;
        long totalOrders = 0;

        if (summary != null && !summary.isEmpty() && summary.get(0) != null) {
            Object[] row = summary.get(0);
            if (row[0] != null) {
                totalIncome = ((Number) row[0]).doubleValue() > 0 ? new BigDecimal(row[0].toString()) : BigDecimal.ZERO;
            }
            if (row[1] != null) {
                totalOrders = ((Number) row[1]).longValue();
            }
        }

        int daysInMonth = yearMonth.lengthOfMonth();
        BigDecimal avgDailyIncome = daysInMonth > 0
                ? totalIncome.divide(BigDecimal.valueOf(daysInMonth), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Category breakdown
        List<Object[]> categoryRows = orderRepository.getMonthlyCategoryBreakdown(startOfMonth, endOfMonth);
        List<CategoryIncomeResponse> categoryBreakdown = new ArrayList<>();

        for (Object[] row : categoryRows) {
            String catName = (String) row[0];
            long ordersCount = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            BigDecimal catRevenue = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;

            double percentage = totalIncome.compareTo(BigDecimal.ZERO) > 0
                    ? catRevenue.divide(totalIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;

            categoryBreakdown.add(CategoryIncomeResponse.builder()
                    .categoryName(catName)
                    .ordersCount(ordersCount)
                    .totalRevenue(catRevenue.setScale(2, RoundingMode.HALF_UP))
                    .percentageShare(Math.round(percentage * 10.0) / 10.0)
                    .build());
        }

        // Top selling items
        List<Object[]> itemRows = orderRepository.getMonthlyTopSellingItems(startOfMonth, endOfMonth);
        List<TopSellingItemResponse> topSellingItems = new ArrayList<>();

        for (Object[] row : itemRows) {
            String itemName = (String) row[0];
            String categoryName = (String) row[1];
            long quantity = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            BigDecimal revenue = row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO;

            topSellingItems.add(TopSellingItemResponse.builder()
                    .itemName(itemName)
                    .categoryName(categoryName)
                    .totalQuantitySold(quantity)
                    .totalRevenue(revenue.setScale(2, RoundingMode.HALF_UP))
                    .build());
        }

        return MonthlyAnalyticsResponse.builder()
                .year(year)
                .month(month)
                .totalMonthlyIncome(totalIncome.setScale(2, RoundingMode.HALF_UP))
                .totalMonthlyOrders(totalOrders)
                .averageDailyIncome(avgDailyIncome)
                .categoryBreakdown(categoryBreakdown)
                .topSellingItems(topSellingItems)
                .build();
    }
}

