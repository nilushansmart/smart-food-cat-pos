package com.cateringpos.service;

import com.cateringpos.dto.request.LoginRequest;
import com.cateringpos.dto.request.RefreshTokenRequest;
import com.cateringpos.dto.request.RegisterRequest;
import com.cateringpos.dto.response.AuthResponse;
import com.cateringpos.dto.response.UserResponse;

/**
 * Service interface for authentication and identity operations.
 */
public interface AuthService {

    /**
     * Authenticates a user with credentials and returns JWT tokens.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Registers a new customer user and issues initial credentials.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Exchanges a valid refresh token for a new access token.
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Retrieves the profile details of the currently authenticated user.
     */
    UserResponse getCurrentUser(String username);
}

