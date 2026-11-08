package com.cateringpos.dto.response;

import com.cateringpos.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private boolean active;
    private String branchId;
    private LocalDateTime createdAt;
}

