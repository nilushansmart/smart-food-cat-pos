package com.cateringpos.service.impl;

import com.cateringpos.config.GoogleMapsProperties;
import com.cateringpos.dto.response.DistanceMatrixResponse;
import com.cateringpos.service.GoogleMapsService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class GoogleMapsServiceImpl implements GoogleMapsService {

    private static final Logger log = LoggerFactory.getLogger(GoogleMapsServiceImpl.class);

    private final GoogleMapsProperties googleMapsProperties;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public DistanceMatrixResponse calculateDistanceAndEta(String destinationAddress) {
        String origin = googleMapsProperties.getKitchenAddress();
        String apiKey = googleMapsProperties.getApiKey();

        if (StringUtils.hasText(apiKey) && StringUtils.hasText(destinationAddress)) {
            try {
                RestClient restClient = RestClient.builder()
                        .baseUrl("https://maps.googleapis.com")
                        .build();

                String jsonResponse = restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/maps/api/distancematrix/json")
                                .queryParam("origins", origin)
                                .queryParam("destinations", destinationAddress)
                                .queryParam("key", apiKey)
                                .build())
                        .retrieve()
                        .body(String.class);

                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode element = root.path("rows").get(0).path("elements").get(0);

                if ("OK".equals(element.path("status").asText())) {
                    long distanceMeters = element.path("distance").path("value").asLong();
                    long durationSeconds = element.path("duration").path("value").asLong();
                    String durationText = element.path("duration").path("text").asText();

                    BigDecimal distanceKm = BigDecimal.valueOf(distanceMeters)
                            .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
                    int durationMinutes = (int) Math.ceil((double) durationSeconds / 60.0);

                    // $15 base fee + $1.50 per km over 5km
                    BigDecimal deliveryFee = calculateDeliveryFee(distanceKm);

                    return DistanceMatrixResponse.builder()
                            .origin(origin)
                            .destination(destinationAddress)
                            .distanceKm(distanceKm)
                            .durationText(durationText)
                            .durationMinutes(durationMinutes)
                            .calculatedDeliveryFee(deliveryFee)
                            .build();
                }
            } catch (Exception e) {
                log.warn("Google Maps Distance Matrix API call failed: {}. Falling back to default estimate.", e.getMessage());
            }
        }

        // Default realistic fallback for development / offline environments
        BigDecimal defaultDistance = new BigDecimal("8.50");
        return DistanceMatrixResponse.builder()
                .origin(origin)
                .destination(destinationAddress)
                .distanceKm(defaultDistance)
                .durationText("25 mins")
                .durationMinutes(25)
                .calculatedDeliveryFee(calculateDeliveryFee(defaultDistance))
                .build();
    }

    private BigDecimal calculateDeliveryFee(BigDecimal distanceKm) {
        BigDecimal baseFee = new BigDecimal("15.00");
        BigDecimal freeRadiusKm = new BigDecimal("5.00");
        BigDecimal ratePerKm = new BigDecimal("1.50");

        if (distanceKm.compareTo(freeRadiusKm) > 0) {
            BigDecimal excessKm = distanceKm.subtract(freeRadiusKm);
            return baseFee.add(excessKm.multiply(ratePerKm)).setScale(2, RoundingMode.HALF_UP);
        }
        return baseFee.setScale(2, RoundingMode.HALF_UP);
    }
}

