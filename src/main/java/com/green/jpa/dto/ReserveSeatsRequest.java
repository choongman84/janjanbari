package com.green.jpa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReserveSeatsRequest {
    private Long gameId;
    private List<SeatDTO> selectedSeats;
}
