package com.green.jpa.entity.product;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/*
연관관계:
- Cart(N:1): 양방향 관계 (CartItem <-> Cart)
  - 장바구니 상품은 반드시 장바구니 정보가 필요
  - 장바구니와 함께 생성/삭제되어야 함

- Kit(N:1): 단방향 관계 (CartItem -> Kit)
  - 장바구니 상품은 상품 정보가 필요하지만
  - 상품에서 장바구니 정보는 별도 쿼리로 조회

특징:
- 장바구니에 담긴 상품 정보 관리
- 수량과 사이즈 선택 정보 포함
- 담은 시점의 가격 정보 보존
- 생성/수정 시간 자동 기록

장점:
- 장바구니 상품 데이터 캡슐화
- Cart와의 라이프사이클 동기화
- 가격 정보 이력 관리 가능
*/

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@ToString(exclude = {"kit","cart"})
public class CartItem { // 구매자에게 보여질 장바구니 상품 정보
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kit_id")
    private Kit kit;

    private int quantity;
    private String selectedSize;

    @Embedded
    private UniformCustomization customization;

    // 간편 메서드
    public void changeQuantity(int quantity) {
        this.quantity = quantity;
    }
    // 간편 메서드
    public void changeSize(String size) {
        this.selectedSize = size;
    }

    // 총 가격 계산
    public int getTotalPrice() {
        return (kit.getPrice() + 
                (customization != null ? customization.getTotalCustomPrice() : 0)) 
                * quantity;
    }

}
