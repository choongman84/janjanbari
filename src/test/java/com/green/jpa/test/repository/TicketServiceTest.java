//package com.green.jpa.test.repository;
//
//import com.green.jpa.dto.MemberDTO;
//import com.green.jpa.dto.TicketDTO;
//import com.green.jpa.entity.*;
//import com.green.jpa.service.MemberService;
//import com.green.jpa.service.TicketService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//
//@SpringBootTest
//public class TicketServiceTest {
//
//    @Autowired
//    private TicketService ticketService;
//
//    @Autowired
//    private ReservationService reservationService;
//
//    @Autowired
//    private MemberService memberService;
//
//    @Autowired
//    private GameService gameService;
//
//    @Test
//    void testCreateTicketAndCheckReservation() {
//        MemberDTO signupDto = MemberDTO.builder()
//                .name("이충만")
//                .email("choong123@aaa.com")
//                .password("1234")
//                .phone("010-1234-1234")
//                .build();
//        MemberDTO signupResponse = memberService.signup(signupDto);
//        System.out.println("signupResponse = " + signupResponse);
//
//        //로그인
//        MemberDTO loginResponse = memberService.login("choong123@aaa.com", "1234");
//        System.out.println("loginResponse = " + loginResponse);
//
//        // 경기 정보 추가
//        Game game = Game.builder()
//                .homeTeam("REAL MADRID")
//                .awayTeam("FC BARCELONA")
//                .gameDate(LocalDateTime.of(2024, 11, 25, 15, 0))
//                .build();
//        Game createdGame = gameService.createGame(game);
//        System.out.println("createdGame = " + createdGame);
//
//        //에약 생성 !
//        Member member = memberService.getMemberById(loginResponse.getId()).orElseThrow(() -> new RuntimeException(" 회원이 존재하지 않습니다."));
//        Reservation reservation = Reservation.builder()
//                .member(member)
//                .game(createdGame)
//                .ticketBuyStartTime(LocalDateTime.now())
//                .ticketBuyEndTime(LocalDateTime.now().plusHours(1))
//                .build();
//        reservationService.save(reservation);
//        // 티켓 생성
//        for(int i = 1; i <= 10; i++){
//            TicketDTO ticketDto = TicketDTO.builder()
//
//                    .seatNumber("A" + i).stock(1)
//                    .grade(SeatGrade.VIP).price(100000)
//                    .status(SeatStatus.ACTIVE)
//                    .reservationId(reservation.getId())
//                    .build();
//            ticketService.createTicket(ticketDto);
//        }
//
//        TicketDTO ticket = ticketService.getTicketById(1L);
//        System.out.println("Reserved Ticket: " + ticket);
//        System.out.println("Home Team: " + ticket.getHomeTeam());
//        System.out.println("Seat Number: " + ticket.getSeatNumber());
//        // 예약 정보 확인
//        if (!ticket.getHomeTeam().equals("REAL MADRID") || !ticket.getSeatNumber().equals("A1")) {
//            throw new AssertionError("예약 정보가 일치하지 않습니다.");
//        }
//    }
//    @Test
//    public void insertTicket(){
//        for(int i = 100; i <= 210; i++){
//            TicketDTO ticketDto = TicketDTO.builder()
//                    .seatNumber("A" + i).stock(1)
//                    .grade(SeatGrade.VIP).price(100000)
//                    .status(SeatStatus.ACTIVE)
//                    .homeTeam("REAL MADRID")
////                    .reservationId(1l)
//                    .build();
//            ticketService.createTicket(ticketDto);
//        }
//    }
//}
