package com.green.jpa.config;

import com.google.gson.Gson;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.MemberRole;
import com.green.jpa.util.JWTUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private  final JWTUtil jwtUtil;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        log.info("check uri....." + path);

        // Preflight요청은 체크하지 않음
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }

        //api/member/ 경로의 호출은 체크하지 않음
        if(path.startsWith("/api/members/")) {
            return true;
        }

        //이미지 조회 경로는 체크하지 않는다면
        if(path.startsWith("/api/products/view/")) {
            return true;
        }

        if(path.startsWith("/images/")) {
            return true;
        }

        return false;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//        log.info("------------------------JWTCheckFilter.......................");
//
//        String authHeaderStr = request.getHeader("Authorization");
//
//        try {
//            //Bearer accestoken...
//            String accessToken = authHeaderStr.substring(7);
//            Map<String, Object> claims = jwtUtil.validateToken(accessToken);
//
//            log.info("JWT claims: " + claims);
//
//            //filterChain.doFilter(request, response); //이하 추가
//
//            String email = (String) claims.get("email");
//            String pw = (String) claims.get("password");
//            String nickname = (String) claims.get("nickname");
//            Boolean social = (Boolean) claims.get("social");
//            List<String> roleNames = (List<String>) claims.get("roleNames");
//            List<GrantedAuthority> authorities = roleNames.stream()
//                    .map(SimpleGrantedAuthority::new)
//                    .collect(Collectors.toList());
//
//            MemberDTO memberDTO = new MemberDTO(
//                    null, // id (set to null if not available)
//                    email, // email
//                    pw, // password
//                    accessToken, // token
//                    nickname, // name
//                    null, // phone (null as no phone number is provided)
//                    null, // address (null as no address is provided)
//                    MemberRole.valueOf(roleNames.get(0)), // role (assuming `roleNames` contains a valid role name as a string)
//                    LocalDateTime.now(), // createDate (use current time)
//                    null, // modifyDate (null as it might not have been modified yet)
//                    authorities // authorities (set to null or initialize with roles if needed)
//            );
//
//            log.info("-----------------------------------");
//            log.info(memberDTO);
//            log.info(memberDTO.getAuthorities());
//
//            UsernamePasswordAuthenticationToken authenticationToken
//                    = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());
//
//            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//
//            filterChain.doFilter(request, response);
//
//        }catch(Exception e){
//
//            log.error("JWT Check Error..............");
//            log.error(e.getMessage());
//
//            Gson gson = new Gson();
//            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
//
//            response.setContentType("application/json");
//            PrintWriter printWriter = response.getWriter();
//            printWriter.println(msg);
//            printWriter.close();
//
//        }
//    }
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");
    System.out.println("111) doFilterInternal : " +authHeader);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    String token = authHeader.substring(7); // "Bearer " 제거
    System.out.println("222) token : " +token);
    try {
        // 토큰 검증
        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 토큰에서 사용자 정보 추출
        Claims claims = jwtTokenProvider.getClaims(token);
        String username = claims.getSubject();
        String role = claims.get("role", String.class);
        System.out.println("333) role : " +role);
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(username, null, authorities);
        System.out.println("445) authentication : " +authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (Exception e) {
        log.error("JWT Check Error: {}", e.getMessage());

        // refresh token 검증 실패 응답
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"TOKEN_INVALID_OR_EXPIRED\"}");
        return;
    }

    filterChain.doFilter(request, response);
}

}
