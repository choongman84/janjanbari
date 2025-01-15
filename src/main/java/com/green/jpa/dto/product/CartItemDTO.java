package com.green.jpa.dto.product;

import com.green.jpa.entity.product.PatchType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.Setter;

import java.util.List;

/*
용도:
- 장바구니 상품 요청/응답 통합 DTO
- 장바구니 상품 추가/수정/조회에 사용
- 상품 정보 포함

특징:
- 요청/응답 필드 통합
- validation 적용
- 가격 계산 포함
*/
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
// 1125 교체
public class CartItemDTO {
    private Long id;
    private Long kitId;
    private String kitName;
    private String imgUrl;
    
    @Min(1)
    private int quantity;
    
    @NotBlank
    private String size;
    
    private int basePrice;  // 기본 가격
    
    // 커스터마이징 정보
    private UniformCustomizationDTO customization;
    private int totalPrice;  // 총 가격 (기본 가격 + 커스터마이징)

    public void calculateTotalPrice() {
        int customPrice = (customization != null) ? customization.getTotalCustomPrice() : 0;
        this.totalPrice = (basePrice * quantity) + customPrice;
    }
}
