package com.green.jpa.service;

import com.green.jpa.dto.SeatDTO;
import com.green.jpa.dto.TicketDTO;
import com.green.jpa.entity.*;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.SeatRepository;
import com.green.jpa.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final MemberRepository memberRepository;

    private Long currentGameId = null;
    private Long currentSeatNumber = 0L;

    @Override
    @Transactional
    public Ticket createTicket(TicketDTO dto, Long memberId) {
        // Validate inputs
        if (dto.getAwayTeam() == null || dto.getAwayTeam().isBlank()) {
            throw new IllegalArgumentException("Team name cannot be null or blank.");
        }
        if (dto.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero.");
        }
        if (dto.getSeatNumbers() == null || dto.getSeatNumbers().isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }

        // Fetch the member associated with the ticket
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + memberId));

        // Initialize current gameId
        currentGameId = ticketRepository.findMaxGameId().orElse(0L) + 1;

        // Create and save the Ticket entity
        Ticket ticket = toEntity(dto);
        ticket.setGameId(currentGameId);
        ticket.setStock(dto.getSeatNumbers().size());
        ticket.setMember(member);
        ticketRepository.save(ticket);

        // Create and save Seat entities
        List<Seat> seatList = new ArrayList<>();
        for (String seatNumber : dto.getSeatNumbers()) {
            String row = seatNumber.substring(0, 1);
            Long number = Long.parseLong(seatNumber.substring(1));

            Seat seat = Seat.builder()
                    .row(row)
                    .number(number)
                    .grade(dto.getSeatGrade() != null ? dto.getSeatGrade() : SeatGrade.REGULAR)
                    .status(dto.getStatus() != null ? dto.getStatus() : SeatStatus.AVAILABLE)
                    .ticket(ticket)
                    .build();
            seatList.add(seat);
        }
        seatRepository.saveAll(seatList);

        return ticket;
    }

    @Override
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + id));
        ticketRepository.delete(ticket);
    }


    @Override
    public List<Seat> getReservedSeats() {
        return seatRepository.findByStatus(SeatStatus.RESERVED);
    }

    @Transactional
    @Override
    public void purchaseSeats(Long gameId, List<SeatDTO> selectedSeats) {
        // Fetch the ticket by gameId
        Ticket ticket = ticketRepository.findByGameId(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for ID: " + gameId));

        // Iterate through the selected seats and update their status
        for (SeatDTO seatDTO : selectedSeats) {
            Seat seat = seatRepository.findByRowAndNumberAndTicketId(
                    seatDTO.getRow(),seatDTO.getNumber(), ticket.getId()
            ).orElseThrow(() -> new IllegalArgumentException(
                    "Seat not found for Row: " + seatDTO.getRow() + ", Number: " + seatDTO.getNumber()));

            // Update the seat status
            seat.setStatus(SeatStatus.RESERVED);
            seatRepository.save(seat);
        }

        // Update the remaining seat count in the ticket
        ticket.setRemainingSeats(ticket.getRemainingSeats() - selectedSeats.size());
        ticketRepository.save(ticket);
    }


    @Override
    public int checkRemainingSeats(Long gameId) {
        Ticket ticket = ticketRepository.findByGameId(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found for ID: " + gameId));
        return ticket.getStock();
    }

    @Override
    public List<SeatDTO> getSeatStatus(Long gameId) {
        List<Seat> seats = seatRepository.findByGameId(gameId);
        return seats.stream()
                .map(seat -> SeatDTO.builder()
                        .row(seat.getRow())
                        .number(seat.getNumber())
//                        .seatStatus(seat.getStatus())
                        .grade(seat.getGrade())
                        .build())
                .collect(Collectors.toList());
    }
}
