package com.green.jpa.entity.product;

import jakarta.persistence.*;
import lombok.*;

/*
연관관계:
- Order(N:1): 양방향 관계 (OrderItem <-> Order)
  - 주문상품은 반드시 주문 정보가 필요
  - 주문과 함께 생성/삭제되어야 함

- Kit(N:1): 단방향 관계 (OrderItem -> Kit)
  - 주문상품은 상품 정보가 필요하지만
  - 상품에서 주문상품 정보는 별도 쿼리로 조회

특징:
- 주문된 상품의 상세 정보 관리
- 커스터마이징 정보는 임베디드 타입으로 관리
- 주문 시점의 가격 정보 보존

장점:
- 주문 상품 데이터 캡슐화
- Order와의 라이프사이클 동기화
- 가격 정보 이력 관리 가능
*/

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kit_id")
    private Kit kit;

    private String selectedSize;

    private int quantity;
    private int basePrice;

    @Embedded
    private UniformCustomization customization;
}