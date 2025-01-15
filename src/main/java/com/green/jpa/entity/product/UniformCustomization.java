package com.green.jpa.entity.product;

import jakarta.persistence.*;
import lombok.*;

/*
특징:
- OrderItem에서 사용되는 임베디드 타입
- 유니폼 커스터마이징 정보 관리
- 패치 타입은 Enum으로 관리

사용처:
- 주문 시 유니폼 커스터마이징 옵션 선택
- 등번호와 이름 새기기
- 패치 부착 여부와 종류 선택

장점:
- 커스터마이징 데이터 캡슐화
- OrderItem과 생명주기 동일
- 재사용성과 확장성
*/

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UniformCustomization {
    private String customType;      // "none", "player", "custom"
    
    @Enumerated(EnumType.STRING)
    private PatchType patchType;
    private boolean patch;
    private boolean hasPlayerName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    private Player selectedPlayer;
    
    private String playerName;
    private String playerNumber;
    private String customName;
    private String customNumber;
    
    @Builder.Default
    private Integer patchPrice = 0;
    @Builder.Default
    private Integer namePrice = 0;
    @Builder.Default
    private Integer totalCustomPrice = 0;

    public void calculatePrices() {
        this.patchPrice = (patch && patchType != null) ? patchType.getPrice() : 0;
        this.namePrice = (hasPlayerName || selectedPlayer != null || 
                         (customType != null && !customType.equals("none"))) ? 28000 : 0;
        this.totalCustomPrice = this.patchPrice + this.namePrice;
    }
}