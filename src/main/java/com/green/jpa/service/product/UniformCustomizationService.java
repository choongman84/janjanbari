package com.green.jpa.service.product;

import com.green.jpa.dto.product.UniformCustomizationDTO;
import com.green.jpa.entity.product.PatchType;
import com.green.jpa.entity.product.UniformCustomization;

public interface UniformCustomizationService {

    // 기본 CRUD
    UniformCustomizationDTO createCustomization(UniformCustomizationDTO dto);
    UniformCustomizationDTO getCustomization(Long itemId);
    UniformCustomizationDTO updateCustomization(Long itemId, UniformCustomizationDTO dto);

    // 가격 계산
    Integer calculatePatchPrice(PatchType patchType);
    Integer calculateNamePrice(String type, String name, String number);
    Integer calculateTotalPrice(UniformCustomizationDTO dto);

    // 검증
    void validateCustomization(UniformCustomizationDTO dto);

    // 변환
    default UniformCustomization toEntity(UniformCustomizationDTO dto) {
        if (dto == null) return null;

        UniformCustomization entity = UniformCustomization.builder()
                .customType(dto.getType())
                .patch(dto.isPatch())
                .patchType(dto.getPatchType())
                .hasPlayerName(dto.isHasPlayerName())
                .playerName(dto.getPlayerName())
                .playerNumber(dto.getPlayerNumber())
                .customName(dto.getCustomName())
                .customNumber(dto.getCustomNumber())
                .build();
        
        entity.calculatePrices();  // 가격 계산
        return entity;
    }

    default UniformCustomizationDTO toDto(UniformCustomization entity) {
        if (entity == null) return null;

        return UniformCustomizationDTO.builder()
                .type(entity.getCustomType())
                .patch(entity.isPatch())
                .patchType(entity.getPatchType())
                .hasPlayerName(entity.isHasPlayerName())
                .selectedPlayerId(entity.getSelectedPlayer() != null ? 
                    entity.getSelectedPlayer().getId() : null)
                .playerName(entity.getPlayerName())
                .playerNumber(entity.getPlayerNumber())
                .customName(entity.getCustomName())
                .customNumber(entity.getCustomNumber())
                .patchPrice(entity.getPatchPrice())
                .namePrice(entity.getNamePrice())
                .totalCustomPrice(entity.getTotalCustomPrice())
                .build();
    }
}