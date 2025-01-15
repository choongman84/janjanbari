package com.green.jpa.dto.product;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.KitType;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
/*
용도:
- 찜 정보 요청/응답 통합 DTO
- 찜 목록 조회, 추가, 삭제에 사용

특징:
- 상품 기본 정보 포함
- 찜한 시간 정보 포함
*/
public class WishlistDTO {
    private Long id;
    private Long memberId;
    private Long kitId;
    
    // 응답시 필요한 추가 정보
    private String kitName;
    private String imageUrl;
    private int price;
    private KitType kitType;
    private Gender gender;
    
    private LocalDateTime createDate;
    private List<String> images;
    private int stock;
    private String description;
    private boolean isWished;
}
