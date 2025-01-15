package com.green.jpa.repository;

import com.green.jpa.entity.Seat;
import com.green.jpa.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Long> {
    @Query("SELECT s FROM Seat s WHERE s.ticket.gameId = :gameId")
    List<Seat> findByGameId(Long gameId);

    @Query("SELECT s FROM Seat s WHERE s.ticket.id = :ticketId AND s.status = :status")
    List<Seat> findByTicketIdAndStatus(Long ticketId, SeatStatus status);

    List<Seat> findByStatus(SeatStatus status);

    Optional<Seat> findByRowAndNumberAndTicketId(String row, Long number, Long ticketId);
}
