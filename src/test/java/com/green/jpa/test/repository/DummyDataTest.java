//package com.green.jpa.test.repository;
//
//import com.green.jpa.entity.Member;
//import com.green.jpa.entity.Seat;
//import com.green.jpa.entity.SeatGrade;
//import com.green.jpa.entity.SeatStatus;
//import com.green.jpa.entity.Ticket;
//import com.green.jpa.repository.MemberRepository;
//import com.green.jpa.repository.SeatRepository;
//import com.green.jpa.repository.TicketRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@SpringBootTest
//public class DummyDataTest {
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @Autowired
//    private TicketRepository ticketRepository;
//
//    @Autowired
//    private SeatRepository seatRepository;
//
//    @Test
//    public void insertDummyData() {
//        // Create a dummy member
//        Member member = Member.builder()
//                .name("이충만123")
//                .email("lcm123@a.com")
//                .password("1234")
//                .phone("010-1234-5678")
//                .build();
//        memberRepository.save(member);
//
//        // Create a dummy ticket
//        Ticket ticket = Ticket.builder()
//                .gameId(1L)
//                .awayTeam("BARCELONA")
//                .price(5000)
//                .stock(40)
//                .remainingSeats(40)
//                .grade(SeatGrade.REGULAR)
//                .status(SeatStatus.AVAILABLE)
//                .member(member)
//                .build();
//        ticketRepository.save(ticket);
//
//        // Create dummy seats for the ticket
//        List<Seat> seats = new ArrayList<>();
//        String[] rows = {"A", "B", "C", "D"};
//        for (String row : rows) {
//            for (int i = 1; i <= 10; i++) {
//                Seat seat = Seat.builder()
//                        .row(row)
//                        .number((long) i)
//                        .grade(SeatGrade.REGULAR)
//                        .status(SeatStatus.AVAILABLE)
//                        .ticket(ticket)
//                        .build();
//                seats.add(seat);
//            }
//        }
//        seatRepository.saveAll(seats);
//
//        System.out.println("Dummy data inserted successfully.");
//    }
//}
