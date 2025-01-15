package com.green.jpa.dto;

import com.green.jpa.entity.SeatGrade;
import com.green.jpa.entity.SeatStatus;
import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
//@AllArgsConstructor
@Builder
public class SeatDTO {
    private String row; // Seat row (e.g., A, B, C, D)
    private Long number; // Seat number (e.g., 1, 2, 3)
    private SeatGrade grade; // Seat grade (e.g., REGULAR, VIP)
}

