//package com.green.jpa.test.repository;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//
//@SpringBootTest
//public class GameServiceTest {
//
//    @Autowired
//    private GameService gameService;
//
//    @Test
//    void testCreateAndGetGame(){
//        //경기 정보 추가
//        Game game = Game.builder()
//                .homeTeam("REAL MADRID")
//                .awayTeam("FC BARCELONA")
//                .gameDate(LocalDateTime.of(2024,11,25,17,0))
//                .build();
//        Game createGame = gameService.createGame(game);
//        System.out.println("createGame = " + createGame);
//        //경기 정보 조회
//        Game readGame = gameService.getGameById(createGame.getId());
//        System.out.println("Retrieved Game: " + readGame);
//        //경기 정보 확인
//        if(!readGame.getHomeTeam().equals(game.getHomeTeam()) || !readGame.getAwayTeam().equals(game.getAwayTeam())){
//            throw new AssertionError("경기 정보가 일치하지 않습니다.");
//        }
//    }
//}
