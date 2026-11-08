package com.cateringpos.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopSellingItemResponse {

    private String itemName;
    private String categoryName;
    private long totalQuantitySold;
    private BigDecimal totalRevenue;
}

