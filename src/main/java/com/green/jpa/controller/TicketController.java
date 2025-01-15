package com.green.jpa.controller;

import com.green.jpa.dto.ReserveSeatsRequest;
import com.green.jpa.dto.SeatDTO;
import com.green.jpa.dto.TicketDTO;
import com.green.jpa.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ticket")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("/create")
    public ResponseEntity<Void> createTicket(@RequestBody TicketDTO dto) {
        System.out.println("Creating ticket: " + dto);
        dto.setStock(40);
        ticketService.createTicket(dto, dto.getMemberId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<TicketDTO> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reserve-seats")
    public ResponseEntity<Void> reserveSeats(@RequestBody ReserveSeatsRequest request) {
        if (request.getSelectedSeats().isEmpty()) {
            throw new IllegalArgumentException("No seats selected for reservation.");
        }

        for (SeatDTO seat : request.getSelectedSeats()) {
            if (seat.getNumber() == null || seat.getRow() == null) {
                throw new IllegalArgumentException(
                        "Seat information is incomplete: Row: " + seat.getRow() + ", Number: " + seat.getNumber()
                );
            }
        }

        ticketService.purchaseSeats(request.getGameId(), request.getSelectedSeats());
        return ResponseEntity.ok().build();
    }



    @GetMapping("/reserved-seats")
    public ResponseEntity<List<SeatDTO>> getReservedSeats() {
        List<SeatDTO> reservedSeats = ticketService.getReservedSeats().stream()
                .map(seat -> SeatDTO.builder()
                        .row(seat.getRow())
                        .number(seat.getNumber())
                        //.status(seat.getStatus().name()) // Convert enum to String
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservedSeats);
    }
    @GetMapping("/remaining-seats/{gameId}")
    public ResponseEntity<Integer> checkRemainingSeats(@PathVariable Long gameId) {
        int remainingSeats = ticketService.checkRemainingSeats(gameId);
        return ResponseEntity.ok(remainingSeats);
    }

    @GetMapping("/seat-status/{gameId}")
    public ResponseEntity<List<SeatDTO>> getSeatStatus(@PathVariable Long gameId) {
        List<SeatDTO> seatStatus = ticketService.getSeatStatus(gameId);
        return ResponseEntity.ok(seatStatus);
    }
}
