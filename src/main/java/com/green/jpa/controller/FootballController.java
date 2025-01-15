package com.green.jpa.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/football")
@CrossOrigin(origins = "http://localhost:3000")
public class FootballController {

    private static final String API_KEY = "4be5dadee3a04b908cde4c7ba531fe92";
    private static final String BASE_URL = "https://api.football-data.org/v4";

    @GetMapping("/matches")
    public ResponseEntity<Map<String, Object>> getScheduledMatches() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token", API_KEY);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    BASE_URL + "/teams/86/matches?status=SCHEDULED&limit=10",
                    HttpMethod.GET,
                    entity,
                    Map.class);  // Map으로 받기
            System.out.println("777) map:" +response);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}