package com.cateringpos.dto.response;

import com.cateringpos.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String accessToken;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long expiresIn;

    private Long userId;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private Role role;

    private UserResponse user;
}
