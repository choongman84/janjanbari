package com.green.jpa.dto.product;

import lombok.*;

import java.util.List;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
/*
용도:
- 장바구니 정보 요청/응답 통합 DTO
- 장바구니 조회, 상품 추가/수정/삭제에 사용
- 장바구니 상품 목록 포함

특징:
- 모든 필드 포함 (요청/응답 통합)
- 장바구니 상품 목록 관리
- 총 금액 계산 가능
*/
public class CartDTO {
    private Long id;
    private Long memberId;
    private List<CartItemDTO> cartItems;
    private int totalAmount;
}
