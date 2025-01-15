package com.green.jpa.entity.product;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@Builder
/*
연관관계:
- OrderItem(1:N): 단방향 관계 (OrderItem -> Kit)
  - 주문 상품에서 Kit 정보 조회는 필요하지만, Kit에서 주문 내역 조회는 별도 쿼리로 처리
  
- CartItem(1:N): 단방향 관계 (CartItem -> Kit)
  - 장바구니에서 Kit 정보 조회는 필요하지만, Kit에서 장바구니 현황은 별도 쿼리로 처리
  
- Wishlist(1:N): 단방향 관계 (Wishlist -> Kit)
  - 찜 목록에서 Kit 정보 조회는 필요하지만, Kit에서 찜 현황은 별도 쿼리로 처리

특징:
- 상품의 기본 정보를 관리하는 핵심 엔티티
- 이미지와 사이즈는 ElementCollection으로 관리
- 첫 번째 이미지가 대표 이미지로 사용
- 재고 관리 기능 포함

장점:
- 단방향 관계로 구조 단순화
- 순환 참조 위험 없음
- 명확한 책임 분리
*/
public class Kit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;            // 상품명 (필수)
    
    @Column(columnDefinition = "TEXT")
    private String description;     // 상품 설명 (긴 텍스트)
    
    @Column(nullable = false)
    private int price;             // 가격 (필수)
    
    @Column(nullable = false)
    private String season;         // 시즌 정보 (필수)

    @ElementCollection
    @CollectionTable(name = "kit_images", joinColumns = @JoinColumn(name = "kit_id"))
    @OrderColumn(name = "image_order")
    private List<String> images = new ArrayList<>();


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KitType kitType;       // 유니폼 타입 (필수)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;         // 성별 (필수)

    @ElementCollection
    @CollectionTable(name = "kit_sizes")
    private Set<String> sizes;

    @Column(nullable = false)
    private int stock;             // 재고 수량 (필수)

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime modifyDate;

    //1125 추가
    @OneToMany(mappedBy = "kit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Player> players = new ArrayList<>();

    // 대표 이미지 조회 메서드
    public String getMainImage() {
        return !images.isEmpty() ? images.get(0) : null;
    }

    public void decreaseStock(int quantity) {
        int restStock = this.stock - quantity;
        if (restStock < 0) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        this.stock = restStock;
    }

    public void increaseStock(int quantity) {
        this.stock += quantity;
    }

    public boolean hasSize(String size) {
        return sizes.contains(size);
    }
}