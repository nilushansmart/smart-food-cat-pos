package com.cateringpos.service;

import com.cateringpos.dto.request.UserCreateRequest;
import com.cateringpos.dto.request.UserUpdateRequest;
import com.cateringpos.dto.response.UserResponse;

import java.util.List;

/**
 * Service interface for administrative user management.
 */
public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserCreateRequest request);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    UserResponse toggleUserActive(Long id);

    void deleteUser(Long id);
}

