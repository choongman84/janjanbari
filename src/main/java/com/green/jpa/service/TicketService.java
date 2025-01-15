package com.green.jpa.service;

import com.green.jpa.dto.SeatDTO;
import com.green.jpa.dto.TicketDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.Seat;
import com.green.jpa.entity.SeatStatus;
import com.green.jpa.entity.Ticket;

import java.util.List;
import java.util.stream.Collectors;

public interface TicketService {

    Ticket createTicket(TicketDTO dto, Long memberId);

    List<TicketDTO> getAllTickets();

    void deleteTicket(Long id);

    List<Seat> getReservedSeats();

    void purchaseSeats(Long gameId, List<SeatDTO> selectedSeats); // Accept a list of selected seats

    int checkRemainingSeats(Long gameId);

    List<SeatDTO> getSeatStatus(Long gameId);

    default TicketDTO toDto(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .gameId(ticket.getGameId())
                .awayTeam(ticket.getAwayTeam())
                .price(ticket.getPrice())
                .stock(ticket.getStock())
                .remainingSeats(ticket.getStock())
                .memberId(ticket.getMember().getId())
                .seatNumbers(ticket.getSeats().stream()
                        .map(seat -> seat.getRow() + seat.getNumber())
                        .collect(Collectors.toList()))
                .seatGrade(ticket.getGrade())
                .status(ticket.getStatus())
                .build();
    }

    default Ticket toEntity(TicketDTO dto) {
        SeatStatus seatStatus = dto.getStatus() != null ? dto.getStatus() : SeatStatus.AVAILABLE;

        return Ticket.builder()
                .awayTeam(dto.getAwayTeam())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .remainingSeats(dto.getStock())
                .grade(dto.getSeatGrade())
                .status(seatStatus)
                .build();
    }
}
