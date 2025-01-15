package com.green.jpa.service;

import com.green.jpa.dto.PaymentDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.Payment;
import com.green.jpa.entity.PaymentStatus;
import com.green.jpa.entity.product.Order;
import com.green.jpa.entity.product.OrderStatus;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.PaymentRepository;
import com.green.jpa.repository.product.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;

    @Override
    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
        Order order = orderRepository.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다."));

        Member member = memberRepository.findById(paymentDTO.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));

        validatePayment(paymentDTO, order, member);// 결제 검증 메서드

        Payment payment = toEntity(paymentDTO, order, member);
        Payment savedPayment = paymentRepository.save(payment);

        // 결제 성공 시 상태 변경
        savedPayment.setStatus(PaymentStatus.COMPLETE);
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        return toDTO(savedPayment);
    }

    @Override
    public void validatePayment(PaymentDTO paymentDTO, Order order, Member member) {
        // 주문회원 <ㅡ> 회원 일치 여부 확인
        if (!order.getMember().getId().equals(member.getId())) {
            throw new IllegalArgumentException("주문회원과 회원이 일치하지 않습니다.");
        }
        // 상품주문금액 <ㅡ> 결제금액 일치 확인
        if (order.getTotalAmount() != paymentDTO.getAmount()) {
            throw new IllegalArgumentException("주문금액과 결제금액이 일치하지 않습니다.");
        }
        // 주문상태 확인
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("주문상태가 올바르지 않습니다.");
        }
        // 중복 결제 확인
        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }
    }

    @Override
    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));
        return toDTO(payment);
    }

    @Override
    public List<PaymentDTO> getPaymentsByMemberId(Long memberId) {
        return paymentRepository.findByMemberId(memberId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByMemberIdAndStatus(Long memberId, PaymentStatus status) {
        return paymentRepository.findByMemberIdAndStatus(memberId, status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByPayDateBetween(startDate, endDate).stream()
        .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsAboveAmount(int amount) {
        return paymentRepository.findByAmountGreaterThanEqual(amount).stream()
        .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getPaymentsByCardCompany(String cardCompany) {
        return paymentRepository.findByCardCompany(cardCompany).stream()
        .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> getRecentPaymentsByMember(Long memberId) {
        return paymentRepository.findRecentPaymentByMemberId(memberId).stream()
        .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentDTO cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));
        if (payment.getStatus() == PaymentStatus.CANCELLED) {
            throw new IllegalStateException("이미 취소된 결제입니다.");
        }
        if (payment.getStatus() != PaymentStatus.COMPLETE) {
            throw new IllegalStateException("취소 할 수 없는 결제 상태입니다.");
        }
        payment.setStatus(PaymentStatus.CANCELLED);
        payment.setStatusChangeDate(LocalDateTime.now());

        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        Payment savePayment = paymentRepository.save(payment);
        return toDTO(savePayment);
    }

}
