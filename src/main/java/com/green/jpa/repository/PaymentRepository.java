package com.green.jpa.repository;

import com.green.jpa.entity.Payment;
import com.green.jpa.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId); //
    List<Payment> findByMemberId(Long memberId);
    List<Payment> findByMemberIdAndStatus(Long memberId, PaymentStatus status);
    List<Payment> findByPayDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Payment> findByStatus(PaymentStatus status); // 결제 상태
    List<Payment> findByAmountGreaterThanEqual(int amount); // 특정 금액 이상 결제 조회
    List<Payment> findByCardCompany(String cardCompany); // 카드사에 따른 결제내역 조회
    List<Payment> findRecentPaymentByMemberId(Long memberId); // 회원별 최근 결제 내역
}
