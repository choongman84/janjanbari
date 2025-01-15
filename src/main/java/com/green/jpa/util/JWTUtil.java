package com.green.jpa.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secretKey;


    public  String generateToken(Map<String, Object> claims, int minutes) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            return Jwts.builder()
                    .setHeader(Map.of("typ", "JWT"))
                    .setClaims(claims)
                    .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                    .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(minutes).toInstant()))
                    .signWith(key)
                    .compact();
        } catch (Exception e) {
            log.error("Error generating token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    /**
     * Validate and parse JWT Token.
     *
     * @param token the JWT token to validate
     * @return a map of claims
     */
     public Map<String, Object> validateToken(String token) {
        try {
            log.info("Validating token: {}", token);

            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.info("Validated claims: {}", claims);
            return claims;
        } catch (ExpiredJwtException e) {
            log.error("JWT Token expired: {}", e.getMessage());
            throw new JwtException("JWT Token expired");
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT Token: {}", e.getMessage());
            throw new JwtException("Malformed JWT Token");
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT Token: {}", e.getMessage());
            throw new JwtException("Unsupported JWT Token");
        } catch (IllegalArgumentException e) {
            log.error("Illegal argument for JWT Token: {}", e.getMessage());
            throw new JwtException("Illegal argument for JWT Token");
        } catch (Exception e) {
            log.error("Unknown error validating JWT Token: {}", e.getMessage());
            throw new JwtException("JWT Token validation failed");
        }
    }
}
