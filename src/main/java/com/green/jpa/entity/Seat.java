package com.green.jpa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "`row`")
    private String row;
    private Long number; // Seat number within the row

    @Enumerated(EnumType.STRING)
    private SeatStatus status; // RESERVED or AVAILABLE

    @Enumerated(EnumType.STRING)
    private SeatGrade grade; // REGULAR or VIP

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
}
