package com.green.jpa.repository;

import com.green.jpa.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Assuming you need to find the max seat number by gameId
    @Query("SELECT MAX(s.number) FROM Seat s WHERE s.ticket.gameId = :gameId")
    Optional<Long> findMaxSeatNumberByGameId(Long gameId);


    Optional<Ticket> findByGameId(Long gameId);

    @Query("SELECT MAX(t.gameId) FROM Ticket t")
    Optional<Long> findMaxGameId();

}
