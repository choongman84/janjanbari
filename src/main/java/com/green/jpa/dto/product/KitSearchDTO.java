package com.green.jpa.dto.product;

import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.KitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/*
용도:
- 상품 검색 조건 전달
- 다중 조건 검색 지원
- 페이징/정렬 정보 포함

특징:
- 선택적 검색 조건
- 가격 범위 검색
- 재고 상태 검색
*/
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KitSearchDTO {
    private String keyword;        // 검색어 (상품명, 설명)
    private KitType kitType;       // 유니폼 타입
    private Gender gender;         // 성별
    private String season;         // 시즌
    private Integer minPrice;      // 최소 가격
    private Integer maxPrice;      // 최대 가격
    private Boolean inStock;       // 재고 있음 여부
    private String sizes;          // 특정 사이즈 검색
    
    // 정렬 조건
    private String sortBy;         // 정렬 기준 (price, createDate 등)
    private String direction;      // 정렬 방향 (asc, desc)
    
    // 페이징 정보
    private Integer page;          // 페이지 번호
    private Integer size;          // 페이지 크기
}