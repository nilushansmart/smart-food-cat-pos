package com.cateringpos.controller;

import com.cateringpos.dto.ApiResponse;
import com.cateringpos.dto.request.UserCreateRequest;
import com.cateringpos.dto.request.UserUpdateRequest;
import com.cateringpos.dto.response.UserResponse;
import com.cateringpos.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management", description = "Administrative endpoints for managing system users and roles")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List all registered users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user details by ID (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PostMapping
    @Operation(summary = "Create a new user with assigned role (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse createdUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User created successfully", createdUser));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", updatedUser));
    }

    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Toggle user active status (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserActive(@PathVariable Long id) {
        UserResponse updatedUser = userService.toggleUserActive(id);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", updatedUser));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user account (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}

