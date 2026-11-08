package com.cateringpos.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private final SecretKey jwtKey;
    private final long jwtExpirationMs;
    private final SecretKey receiptKey;
    private final long receiptExpirationMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-ms}") long jwtExpirationMs,
            @Value("${app.jwt.receipt-token-secret}") String receiptSecret,
            @Value("${app.jwt.receipt-token-expiration-ms}") long receiptExpirationMs
    ) {
        this.jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
        this.receiptKey = Keys.hmacShaKeyFor(receiptSecret.getBytes(StandardCharsets.UTF_8));
        this.receiptExpirationMs = receiptExpirationMs;
    }

    public String generateAccessToken(CustomUserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userDetails.getId());
        claims.put("role", userDetails.getRole().name());
        claims.put("fullName", userDetails.getFullName());
        claims.put("email", userDetails.getEmail());

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(jwtKey)
                .compact();
    }

    public String generateReceiptToken(Long orderId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("orderId", orderId);

        return Jwts.builder()
                .claims(claims)
                .subject("RECEIPT_ACCESS")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + receiptExpirationMs))
                .signWith(receiptKey)
                .compact();
    }

    public boolean validateReceiptToken(String token, Long orderId) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(receiptKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Number claimOrderId = claims.get("orderId", Number.class);
            return claimOrderId != null && claimOrderId.longValue() == orderId;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid receipt token: {}", e.getMessage());
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(jwtKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            log.warn("JWT token validation error: {}", e.getMessage());
        }
        return false;
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Number userId = claims.get("userId", Number.class);
        return userId != null ? userId.longValue() : null;
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }
}

