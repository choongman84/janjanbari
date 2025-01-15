package com.green.jpa.dto.product;

import com.green.jpa.entity.product.PatchType;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
/*
용도:
- 유니폼 커스터마이징 정보 요청/응답 통합 DTO
- 패치, 이름 등 커스터마이징 옵션 관리
- 가격 정보 포함

특징:
- 모든 필드 포함 (요청/응답 통합)
- 가격 정보 포함
- 선택된 옵션 정보 제공
*/
public class UniformCustomizationDTO {
    private String type;  // "none", "player", "custom"
    
    // 패치 관련
    private boolean patch;
    private PatchType patchType;
    
    // 선수 선택 관련
    private boolean hasPlayerName;
    private Long selectedPlayerId;
    private String playerName;
    private String playerNumber;
    
    // 커스텀 이름/번호
    private String customName;
    private String customNumber;
    
    // 가격 정보
    @Builder.Default
    private Integer patchPrice = 0;
    @Builder.Default
    private Integer namePrice = 0;
    @Builder.Default
    private Integer totalCustomPrice = 0;

    public void calculatePrices() {
        this.patchPrice = (patch && patchType != null) ? patchType.getPrice() : 0;
        this.namePrice = (hasPlayerName || type.equals("player") || type.equals("custom")) ? 28000 : 0;
        this.totalCustomPrice = this.patchPrice + this.namePrice;
    }
}
