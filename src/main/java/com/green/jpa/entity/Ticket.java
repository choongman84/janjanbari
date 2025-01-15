package com.green.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long gameId; // Ensure this field is present
    private String awayTeam;
    private int price;
    private int stock;

    private Long ticketId;
    private Long ticketDate;

    private int remainingSeats; // 전체 잔여 좌석

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "ticket_id")
    private List<Seat> seats;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    @Enumerated(EnumType.STRING)
    private SeatGrade grade;


    // Adding the member relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // Reference to the member who purchased/reserved the ticket
}
