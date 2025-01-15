package com.green.jpa.entity.product;

import com.green.jpa.entity.Address;
import com.green.jpa.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    private int totalAmount;        // 총 주문 금액

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;     // 주문 상태

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime orderDate;

    @LastModifiedDate
    private LocalDateTime modifyDate;

    @Column(nullable = false)
    private String receiver;        // 수령인
    private String receiverPhone;   // 수령인 연락처
    
    @Embedded
    private Address address;        // 배송지 정보
    
    private String deliveryMessage; // 배송 메시지

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

    public void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .mapToInt(item -> {
                    int basePrice = item.getBasePrice();
                    int customPrice = item.getCustomization() != null ? 
                        item.getCustomization().getTotalCustomPrice() : 0;
                    return (basePrice + customPrice) * item.getQuantity();
                })
                .sum();
    }
}