package com.cateringpos.service.impl;

import com.cateringpos.dto.request.LoginRequest;
import com.cateringpos.dto.request.RegisterRequest;
import com.cateringpos.dto.response.AuthResponse;
import com.cateringpos.dto.response.UserResponse;
import com.cateringpos.entity.RefreshToken;
import com.cateringpos.entity.User;
import com.cateringpos.enums.Role;
import com.cateringpos.exception.BadRequestException;
import com.cateringpos.mapper.UserMapper;
import com.cateringpos.repository.RefreshTokenRepository;
import com.cateringpos.repository.UserRepository;
import com.cateringpos.security.CustomUserDetails;
import com.cateringpos.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private CustomUserDetails userDetails;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshExpirationMs", 604800000L);

        sampleUser = User.builder()
                .id(1L)
                .username("john_doe")
                .email("john@example.com")
                .password("hashed_pwd")
                .fullName("John Doe")
                .phone("+15551234567")
                .role(Role.ROLE_CUSTOMER)
                .active(true)
                .branchId("MAIN")
                .build();

        userDetails = new CustomUserDetails(sampleUser);
    }

    @Test
    @DisplayName("login() should successfully authenticate user and return tokens")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("john_doe", "password123");
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(jwtUtil.generateAccessToken(userDetails)).thenReturn("mock_jwt_token");

        RefreshToken token = RefreshToken.builder()
                .token("uuid_refresh_token")
                .user(sampleUser)
                .expiryDate(Instant.now().plusMillis(604800000L))
                .build();
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(token);

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .username("john_doe")
                .role(Role.ROLE_CUSTOMER)
                .build();
        when(userMapper.toResponse(sampleUser)).thenReturn(userResponse);

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("mock_jwt_token");
        assertThat(response.getRefreshToken()).isEqualTo("uuid_refresh_token");
        assertThat(response.getUser().getUsername()).isEqualTo("john_doe");
    }

    @Test
    @DisplayName("register() should throw BadRequestException if username already exists")
    void testRegisterDuplicateUsername() {
        RegisterRequest request = new RegisterRequest("john_doe", "john@example.com", "password123", "John Doe", "+15551234567");
        when(userRepository.existsByUsername("john_doe")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Username is already taken");

        verify(userRepository, never()).save(any());
    }
}

