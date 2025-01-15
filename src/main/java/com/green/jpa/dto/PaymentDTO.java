package com.green.jpa.dto;

import com.green.jpa.entity.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PaymentDTO {

    private Long id; // 결제id
    private Long memberId; // 결제한 회원ID
    private Long orderId; // 결제한 주문ID
    private String paymentMethod; // 결제방법
    private int amount; // 총액
    private String cardNumber; // 카드번호
    private String cardCompany; // 카드회사
    private PaymentStatus status; // 상태 완료,취소
    private LocalDateTime payDate; // 결제일
    private LocalDateTime statusChangeDate; // 결제 취소일
}
