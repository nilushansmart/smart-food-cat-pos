package com.cateringpos.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryIncomeResponse {

    private String categoryName;
    private long ordersCount;
    private BigDecimal totalRevenue;
    private double percentageShare;
}

