package com.green.jpa.dto.product;

import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.KitType;
import com.green.jpa.entity.product.PatchType;
import com.green.jpa.entity.product.UniformCustomization;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;



@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
/*
용도:
- 상품 정보 요청/응답 통합 DTO
- 상품 등록, 수정, 조회에 사용
- 이미지와 사이즈 목록 포함

특징:
- 모든 필드 포함 (요청/응답 통합)
- validation 적용
- 컬렉션 데이터 포함
*/
public class KitDTO {
    private Long id;
    
//    @NotBlank(message = "상품명은 필수입니다")
    private String name;
    
    private String description;
    
//    @Min(value = 0, message = "가격은 0원 이상이어야 합니다")
    private int price;
    
//    @NotBlank(message = "시즌 정보는 필수입니다")
    private String season;
    
    private List<String> images;
    
//    @NotNull(message = "유니폼 타입은 필수입니다")
    private KitType kitType;
    
//    @NotNull(message = "성별은 필수입니다")
    private Gender gender;
    
    private Set<String> sizes;

    private UniformCustomizationDTO customization;
    
//    @Min(value = 0, message = "재고는 0개 이상이어야 합니다")
    private int stock;
    
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

    //1125 데이터 추가
    private List<PlayerDTO> availablePlayers;
    private Map<PatchType, Integer> patchPrices;
    private int nameNumberPrice;
}