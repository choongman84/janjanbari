package com.green.jpa.controller;

import com.green.jpa.config.JWTUtil;
import com.green.jpa.config.JwtTokenProvider;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.MemberRole;
import com.green.jpa.service.MemberService;
import com.green.jpa.util.CustomJWTException;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Log4j2
public class MemberController {

    private final MemberService memberService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid MemberDTO loginRequest) {
        log.info("Login request received: {}", loginRequest);

        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            log.info("Authentication successful for email: {}", loginRequest.getEmail());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT tokens
            MemberDTO user = (MemberDTO) authentication.getPrincipal();
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            claims.put("role", user.getRole());

            String accessToken = jwtTokenProvider.generateToken(claims, 10); // 10 minutes
            String refreshToken = jwtTokenProvider.generateToken(claims, 1440); // 24 hours

            log.info("Generated tokens for user: {}", user.getEmail());
            return ResponseEntity.ok(Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "user", user
            ));
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "INVALID_CREDENTIALS"));
        } catch (Exception e) {
            log.error("Error during login process: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "LOGIN_ERROR"));
        }



    }

//    @PostMapping("/refresh")
//    public ResponseEntity<?> refreshAccessToken(@RequestHeader("Refresh-Token") String refreshToken) {
//        log.info("Processing refresh token...");
//
//        try {
//            // Validate the refresh token
//            if (!jwtTokenProvider.validateToken(refreshToken)) {
//                log.warn("Invalid refresh token.");
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("error", "INVALID_REFRESH_TOKEN"));
//            }
//
//            // Extract claims from the refresh token
//            Claims claims = jwtTokenProvider.getClaims(refreshToken);
//            String email = claims.get("email", String.class);
//            String role = claims.get("role", String.class);
//
//            log.info("Valid refresh token for email: {}", email);
//
//            // Create new tokens
//            Map<String, Object> newClaims = Map.of(
//                    "email", email,
//                    "role", role
//            );
//
//            String newAccessToken = jwtTokenProvider.generateToken(newClaims, 10); // 10 minutes
//            String newRefreshToken = jwtTokenProvider.generateToken(newClaims, 1440); // 24 hours
//
//            log.info("Generated new tokens for email: {}", email);
//            return ResponseEntity.ok(Map.of(
//                    "accessToken", newAccessToken,
//                    "refreshToken", newRefreshToken
//            ));
//
//        } catch (Exception e) {
//            log.error("Error while refreshing token: {}", e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", "TOKEN_REFRESH_ERROR"));
//        }
//    }

    @RequestMapping("/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, String refreshToken){

        if(refreshToken == null) {
            throw new CustomJWTException("NULL_REFRASH");
        }

        if(authHeader == null || authHeader.length() < 7) {
            throw new CustomJWTException("INVALID_STRING");
        }

        String accessToken = authHeader.substring(7);

        //Access 토큰이 만료되지 않았다면
        if(checkExpiredToken(accessToken) == false ) {
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }

        //Refresh토큰 검증
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

        log.info("refresh ... claims: " + claims);

        String newAccessToken = JWTUtil.generateToken(claims, 10);

        String newRefreshToken =  checkTime((Integer)claims.get("exp")) == true? JWTUtil.generateToken(claims, 60*24) : refreshToken;

        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);

    }

    //시간이 1시간 미만으로 남았다면
    private boolean checkTime(Integer exp) {

        //JWT exp를 날짜로 변환
        java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));

        //현재 시간과의 차이 계산 - 밀리세컨즈
        long gap   = expDate.getTime() - System.currentTimeMillis();

        //분단위 계산
        long leftMin = gap / (1000 * 60);

        //1시간도 안남았는지..
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String token) {

        try{
            JWTUtil.validateToken(token);
        }catch(CustomJWTException ex) {
            if(ex.getMessage().equals("Expired")){
                return true;
            }
        }
        return false;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid MemberDTO memberDTO) {
        log.info("Signup request received: {}", memberDTO);

        try {
            memberDTO.setRole(MemberRole.USER);
            MemberDTO savedMember = memberService.signup(memberDTO);

            log.info("User successfully signed up with email: {}", savedMember.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
        } catch (IllegalArgumentException e) {
            log.error("Signup error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during signup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "SIGNUP_ERROR"));
        }
    }

    @GetMapping("/mypage/{id}")
    public ResponseEntity<?> getEmail(@PathVariable Long id) {
        log.info("Fetching email for member ID: {}", id);

        try {
            Member member = memberService.findById(id);
            return ResponseEntity.ok(Map.of("email", member.getEmail()));
        } catch (IllegalArgumentException e) {
            log.error("Error fetching email for member ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error fetching email: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "FETCH_EMAIL_ERROR"));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentMemberId(@RequestHeader("Authorization") String token) {
        log.info("Fetching current member ID using token.");

        try {
            Long memberId = memberService.getMemberIdFromToken(token);
            return ResponseEntity.ok(Map.of("memberId", memberId));
        } catch (IllegalArgumentException e) {
            log.error("Invalid token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching member ID from token: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "TOKEN_ERROR"));
        }
    }
}
