package com.green.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@ToString
/*
특징:
- 주소 정보를 담는 임베디드 타입
- Member와 Order 엔티티에서 사용
- 카카오 주소 API와 연동하여 사용

장점:
- 주소 관련 데이터 캡슐화
- 재사용성 향상
- 주소 데이터 일관성 유지
*/
public class Address {
    @Column(nullable = false)
    private String address;        // 기본 주소 (도로명 주소)
    
    private String detailAddress;  // 상세 주소
    
    @Column(nullable = false)
    private String zipcode;        // 우편번호
} 