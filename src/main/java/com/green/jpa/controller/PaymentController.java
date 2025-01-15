package com.green.jpa.controller;

import com.green.jpa.dto.PaymentDTO;
import com.green.jpa.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")  // React 서버 주소
public class PaymentController {

    private final PaymentService paymentService;
    private static final Long TEMP_MEMBER_ID = 1L;  // 임시 회원 ID

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@RequestBody PaymentDTO paymentDTO) {
        // 임시 회원 ID 설정
        paymentDTO.setMemberId(TEMP_MEMBER_ID);
        PaymentDTO processedPayment = paymentService.processPayment(paymentDTO);
        return ResponseEntity.ok(processedPayment);
    }

    @PostMapping("/cancel/{paymentId}")
    public ResponseEntity<PaymentDTO> cancelPayment(@PathVariable Long paymentId) {
        PaymentDTO cancelledPayment = paymentService.cancelPayment(paymentId);
        return ResponseEntity.ok(cancelledPayment);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDTO payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/member")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByMemberId() {
        List<PaymentDTO> payments = paymentService.getPaymentsByMemberId(TEMP_MEMBER_ID);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/member/recent")
    public ResponseEntity<List<PaymentDTO>> getRecentPayments() {
        List<PaymentDTO> recentPayments = paymentService.getRecentPaymentsByMember(TEMP_MEMBER_ID);
        return ResponseEntity.ok(recentPayments);
    }

    @GetMapping("/card-company/{cardCompany}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByCardCompany(@PathVariable String cardCompany) {
        List<PaymentDTO> payments = paymentService.getPaymentsByCardCompany(cardCompany);
        return ResponseEntity.ok(payments);
    }

    // 에러 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
