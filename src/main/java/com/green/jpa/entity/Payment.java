package com.green.jpa.entity;

import com.green.jpa.entity.product.Order;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 결제수단, 결제방법 영어로 paymentMethod라함
    private String paymentMethod;
    private int amount; // 결제금액
    private String cardNumber;// 결제할 카드번호
    private String cardCompany;// 결제할 카드회사

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // 결제 상태 완료, 취소 만있음 대기도만들어야하나?

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime payDate; // 결제 date
    @LastModifiedDate
    private LocalDateTime statusChangeDate; // 결제 취소됐을시, 상태업데이트 날짜

}
