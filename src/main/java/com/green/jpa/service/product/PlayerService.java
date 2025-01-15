package com.green.jpa.service.product;

import com.green.jpa.dto.product.PlayerDTO;
import com.green.jpa.entity.product.Player;

import java.util.List;

public interface PlayerService {
    List<PlayerDTO> getAvailablePlayers();

    PlayerDTO getPlayerById(Long id);

    PlayerDTO getPlayerByNumber(String number);

    List<PlayerDTO> getPlayersByPosition(String position);

    List<PlayerDTO> getPlayersByKitId(Long kitId);

    // DTO 변환 메서드
    default PlayerDTO toDto(Player player) {
        return PlayerDTO.builder()
                .id(player.getId())
                .name(player.getName())
                .number(player.getNumber())
                .position(player.getPosition())
                .build();
    }

}