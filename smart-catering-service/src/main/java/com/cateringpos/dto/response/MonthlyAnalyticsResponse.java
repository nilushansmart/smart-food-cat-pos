package com.cateringpos.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyAnalyticsResponse {

    private int year;
    private int month;
    private BigDecimal totalMonthlyIncome;
    private long totalMonthlyOrders;
    private BigDecimal averageDailyIncome;
    private List<CategoryIncomeResponse> categoryBreakdown;
    private List<TopSellingItemResponse> topSellingItems;
}

