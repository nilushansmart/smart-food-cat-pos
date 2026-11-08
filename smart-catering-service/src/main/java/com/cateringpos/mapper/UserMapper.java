package com.cateringpos.mapper;

import com.cateringpos.dto.request.UserCreateRequest;
import com.cateringpos.dto.response.UserResponse;
import com.cateringpos.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .branchId(user.getBranchId())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toEntity(UserCreateRequest request, String encodedPassword) {
        if (request == null) {
            return null;
        }

        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encodedPassword)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole())
                .branchId(request.getBranchId() != null ? request.getBranchId() : "MAIN")
                .active(true)
                .build();
    }
}

