package com.green.jpa.service.product;

import com.green.jpa.dto.product.PlayerDTO;
import com.green.jpa.entity.product.Player;
import com.green.jpa.repository.product.PlayerRepository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;

    @PostConstruct
    @Transactional
    public void initializePlayers() {
        // 이미 데이터가 있는지 확인
        if (playerRepository.count() > 0) {
            return;
        }

        // 레알 마드리드 선수 데이터 초기화
        List<Player> players = Arrays.asList(
            Player.builder().name("Jude Bellingham").number("5").position("MF").build(),
            Player.builder().name("Vinícius Júnior").number("7").position("FW").build(),
            Player.builder().name("Luka Modrić").number("10").position("MF").build(),
            Player.builder().name("Rodrygo").number("11").position("FW").build(),
            Player.builder().name("Thibaut Courtois").number("1").position("GK").build(),
            Player.builder().name("Éder Militão").number("3").position("DF").build(),
            Player.builder().name("Antonio Rüdiger").number("22").position("DF").build(),
            Player.builder().name("Toni Kroos").number("8").position("MF").build(),
            Player.builder().name("Federico Valverde").number("15").position("MF").build(),
            Player.builder().name("Eduardo Camavinga").number("12").position("MF").build()
        );

        playerRepository.saveAll(players);
    }

    @Override
    public List<PlayerDTO> getAvailablePlayers() {
        return playerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDTO getPlayerById(Long id) {
        return playerRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Player not found with id: " + id));
    }

    @Override
    public PlayerDTO getPlayerByNumber(String number) {
        return playerRepository.findByNumber(number)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public List<PlayerDTO> getPlayersByPosition(String position) {
        return playerRepository.findByPosition(position).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> getPlayersByKitId(Long kitId) {
        return playerRepository.findByKitId(kitId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

}