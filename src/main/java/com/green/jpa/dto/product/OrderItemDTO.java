package com.green.jpa.dto.product;

import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.KitType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
/*
용도:
- 주문 상품 정보 요청/응답 통합 DTO
- 주문 상품 생성, 조회에 사용
- 커스터마이징 정보 포함

특징:
- 모든 필드 포함 (요청/응답 통합)
- validation 적용
- 주문 시점의 가격 보존
*/
public class OrderItemDTO {
  private Long id;
  private Long orderId;
  private Long kitId;

  private String kitName; // 상품명
  private String imageUrl; // 대표이미지
  private KitType kitType; // 유니폼 타입
  private Gender gender; // 성별

  @NotBlank(message = "사이즈 선택은 필수 입니다.")
  private String selectedSize;

  @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
  private int quantity;

  private int basePrice;           // 기본 가격
  private UniformCustomizationDTO customization;  // 커스터마이징 정보
  private int totalPrice;          // 총 가격 (기본 가격 + 커스터마이징 가격) * 수량

}