package com.green.jpa.security;


import com.google.gson.Gson;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Component
@Log4j2
@RequiredArgsConstructor
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil; // JWTUtil 주입
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 인증 성공 시 호출
        log.info("-----Success-----");
        log.info(authentication);
        log.info("-----------------");

        // p317
        MemberDTO dto = (MemberDTO) authentication.getPrincipal();
        Map<String, Object> claims = dto.toClaims();
        String accessToken = jwtUtil.generateToken(claims, 60*24); // 10분
        String refreshToken = jwtUtil.generateToken(claims, 60*24); // 24시간
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        Gson gson = new Gson();
        String json = gson.toJson(claims);
        response.setContentType("application/json; charset=utf-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(json);
        printWriter.close();
    }
}
