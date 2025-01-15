package com.green.jpa.dto;

import com.green.jpa.entity.SeatGrade;
import com.green.jpa.entity.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor // Required for the toDto method to work properly
public class TicketDTO {

    private Long id; // Ticket ID
    private Long gameId; // Game ID
    private String awayTeam; // Away team name
    private int price; // Price of the ticket
    private int stock; // Stock or seat availability
    private int remainingSeats; // Remaining seats for the game
    private Long memberId; // ID of the associated member
    private List<String> seatNumbers; // List of reserved seat numbers
    private SeatGrade seatGrade; // Grade of the seats (REGULAR or VIP)
    private SeatStatus status; // Status of the ticket (e.g., AVAILABLE, RESERVED, etc.)
}
