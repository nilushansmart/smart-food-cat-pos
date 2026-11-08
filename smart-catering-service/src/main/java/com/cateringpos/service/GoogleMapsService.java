package com.cateringpos.service;

import com.cateringpos.dto.response.DistanceMatrixResponse;

/**
 * Service interface for Google Maps Geocoding and Distance Matrix calculations.
 */
public interface GoogleMapsService {

    /**
     * Calculates distance and estimated travel time from the catering kitchen to a venue address.
     */
    DistanceMatrixResponse calculateDistanceAndEta(String destinationAddress);
}

