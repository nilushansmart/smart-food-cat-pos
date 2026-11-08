package com.cateringpos.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistanceMatrixResponse {

    private String origin;
    private String destination;
    private BigDecimal distanceKm;
    private String durationText;
    private Integer durationMinutes;
    private BigDecimal calculatedDeliveryFee;
}

