package com.green.jpa.dto.product;

import com.green.jpa.entity.product.PatchType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

//1125 추가
public class CustomizationRequestDTO {
    private String type;  // "none", "player", "custom"
    private boolean patch;
    private PatchType patchType;
    
    private Long selectedPlayerId;  // 선수 선택 시
    private String playerName;      // 선수 이름
    private String playerNumber;    // 선수 번호

    private boolean customNameNumber;
    private String customName;      // 커스텀 이름
    private String customNumber;    // 커스텀 번호
}