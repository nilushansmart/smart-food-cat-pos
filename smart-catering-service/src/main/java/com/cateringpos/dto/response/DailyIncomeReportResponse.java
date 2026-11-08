package com.cateringpos.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyIncomeReportResponse {

    private LocalDate date;
    private BigDecimal totalIncome;
    private long totalOrders;
    private long completedOrders;
    private long pendingOrders;
    private long cancelledOrders;
    private BigDecimal averageOrderValue;
    private List<OrderResponse> orders;
}

