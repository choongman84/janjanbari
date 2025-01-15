package com.green.jpa.entity.product;

import com.green.jpa.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
/*
연관관계:
- Member(1:1): 단방향 관계 (Cart -> Member)
  - 장바구니는 반드시 회원 정보가 필요
  - 회원당 하나의 장바구니만 존재

- CartItem(1:N): 양방향 관계
  - 장바구니와 장바구니 상품은 밀접한 연관관계
  - 장바구니 조회시 항상 상품 목록이 필요
  - cascade로 함께 관리

특징:
- 회원의 장바구니 정보 관리
- 장바구니 상품 목록 관리
- 회원 가입시 자동 생성 가능

장점:
- 회원당 하나의 장바구니 보장
- 장바구니 상품과 생명주기 동기화
- 간단한 구조로 관리 용이
*/

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", unique = true)
    private Member member;

    // 장바구니와 장바구니의 상품의 정보는 전체 조회 기능이 자주 사용되고 상품 추가/삭제가 빈번함
    // 장바구니 상품 목록 관리가 중요함으로 양방향으로 관계 설정하는것이 더 좋음
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();
    
    public void addCartItem(CartItem cartItem) {
        cartItems.add(cartItem);
        cartItem.setCart(this);
    }
}
