package com.green.jpa.service;

import java.time.LocalDateTime;
import java.util.List;

import com.green.jpa.dto.PaymentDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.Payment;
import com.green.jpa.entity.PaymentStatus;
import com.green.jpa.entity.product.Order;

public interface PaymentService {
      // 결제 처리
    PaymentDTO processPayment(PaymentDTO paymentDTO);
    
    // 결제 검증
    void validatePayment(PaymentDTO paymentDTO, Order order, Member member);
    
    // 결제 조회
    PaymentDTO getPaymentByOrderId(Long orderId);
    List<PaymentDTO> getPaymentsByMemberId(Long memberId);
    List<PaymentDTO> getPaymentsByMemberIdAndStatus(Long memberId, PaymentStatus status);
    List<PaymentDTO> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    List<PaymentDTO> getPaymentsByStatus(PaymentStatus status);
    List<PaymentDTO> getPaymentsAboveAmount(int amount);
    List<PaymentDTO> getPaymentsByCardCompany(String cardCompany);
    List<PaymentDTO> getRecentPaymentsByMember(Long memberId);
    
    // 결제 취소
    PaymentDTO cancelPayment(Long paymentId);

    default Payment toEntity(PaymentDTO dto, Order order, Member member) {
        if (dto == null) {
            return null;
        } // dto가 null이면 null 반환 NPE 방지용
        
        return Payment.builder()
                .member(member)
                .order(order)
                .amount(order.getTotalAmount()) // 주문금액이 PaymentDTO에 있는 금액과 같으면 주문금액으로 결제 하게 유도
                .paymentMethod(dto.getPaymentMethod())
                .cardNumber(maskCardNumber(dto.getCardNumber())) // 카드번호 마스킹처리 Entity에도 해야하나?
                .cardCompany(dto.getCardCompany())
                .status(dto.getStatus() != null ? dto.getStatus() : PaymentStatus.PENDING) // 기본값으로 결제대기 상태
                .payDate(LocalDateTime.now())
                .statusChangeDate(LocalDateTime.now())
                .build();
    }

    default PaymentDTO toDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .memberId(payment.getMember().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .cardNumber(payment.getCardNumber()) // 마스킹처리된 카드번호를 DTO로 표시
                .cardCompany(payment.getCardCompany())
                .status(payment.getStatus())
                .payDate(payment.getPayDate())
                .statusChangeDate(payment.getStatusChangeDate())
                .build();
    }
    
    // 카드번호 마스킹 처리를 위한 유틸리티 메서드
    default String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return cardNumber;
        }
        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        return "*".repeat(cardNumber.length() - 4) + lastFour;
    }
}
