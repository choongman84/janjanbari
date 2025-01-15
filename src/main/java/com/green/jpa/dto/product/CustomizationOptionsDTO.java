package com.green.jpa.dto.product;

import com.green.jpa.entity.product.PatchType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 1125 추가
public class CustomizationOptionsDTO {
    private List<PlayerDTO> availablePlayers;
    private List<PatchType> availablePatches;
    private int basePrice;
    private int nameNumberPrice;
    private Map<PatchType, Integer> patchPrices;
}