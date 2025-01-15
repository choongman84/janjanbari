//package com.green.jpa.test.service;
//
//import com.green.jpa.dto.*;
//import com.green.jpa.dto.product.*;
//import com.green.jpa.entity.*;
//import com.green.jpa.entity.product.*;
//import com.green.jpa.service.PaymentService;
//import com.green.jpa.service.product.CartService;
//import com.green.jpa.service.product.OrderService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
///*
//    * 테스트 주의사항 *
//    * 1.DB에 회원이 존재해야함. 프론트에서 회원가입 해놓으셈
//    * 2.DB에 Cart와 CartItem이 존재해야함. kits/add가서 물품추가하고
//    * kits에서 물품 카트에 넣어두셈
// */
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@Transactional
//class PaymentServiceTest {
//
//    @Autowired
//    private PaymentService paymentService;
//
//    @Autowired
//    private CartService cartService;
//
//    @Autowired
//    private OrderService orderService;
//
//    private CartDTO testCartDTO;
//    private OrderDTO testOrderDTO;
//    private PaymentDTO testPaymentDTO;
//
//    @BeforeEach
//    void setUp() {
//        // 1. 기존 장바구니 데이터 가져오기
//        CartDTO cartDTO = cartService.getCart(1L);
//        System.out.println("현재 장바구니 상태: " + cartDTO);
//
//        // 2. 주문 정보 생성 (장바구니의 실제 금액 사용)
//        testOrderDTO = OrderDTO.builder()
//                .memberId(1L)
//                .totalAmount(cartDTO.getTotalAmount())  // 장바구니의 실제 총액 사용
//                .status(OrderStatus.PENDING)
//                .receiver("홍길동")
//                .receiverPhone("01012345678")
//                .address(AddressDTO.builder()
//                        .address("서울특별시")
//                        .detailAddress("강남구 역삼동")
//                        .zipcode("12345")
//                        .build())
//                .deliveryMessage("부재시 경비실에 맡겨주세요")
//                .orderDate(LocalDateTime.now())
//                .sameAsOrder(false)
//                .build();
//
//        // 3. 결제 정보 생성 (장바구니의 실제 금액 사용)
//        testPaymentDTO = PaymentDTO.builder()
//                .memberId(1L)
//                .amount(cartDTO.getTotalAmount())  // 장바구니의 실제 총액 사용
//                .paymentMethod("CARD")
//                .cardNumber("1234-5678-9012-3456")
//                .cardCompany("신한카드")
//                .status(PaymentStatus.PENDING)
//                .build();
//
//        System.out.println("테스트 데이터 생성 완료");
//    }
//
//    @Test
//    @DisplayName("장바구니에서 결제 프로세스 통합 테스트")
//    void processPaymentFromCartIntegrationTest() {
//        // 1. 장바구니에서 주문 생성
//        OrderDTO savedOrder = orderService.createOrderFromCart(1L, testOrderDTO);
//        System.out.println("장바구니에서 주문 생성 완료: " + savedOrder);
//
//        // 2. 결제 DTO 업데이트
//        testPaymentDTO.setOrderId(savedOrder.getId());
//
//        // 3. 결제 처리
//        PaymentDTO result = paymentService.processPayment(testPaymentDTO);
//        System.out.println("결제 처리 완료: " + result);
//
//        // 검증
//        assertNotNull(result);
//        assertEquals(PaymentStatus.COMPLETE, result.getStatus());
//        assertEquals(testPaymentDTO.getAmount(), result.getAmount());
//    }
//
//    @Test
//    @DisplayName("결제 취소 테스트")
//    void cancelPaymentTest() {
//        // 1. 장바구니에서 주문 생성
//        OrderDTO savedOrder = orderService.createOrderFromCart(1L, testOrderDTO);
//        testPaymentDTO.setOrderId(savedOrder.getId());
//
//        // 2. 결제 처리
//        PaymentDTO payment = paymentService.processPayment(testPaymentDTO);
//
//        // 3. 결제 취소
//        PaymentDTO cancelled = paymentService.cancelPayment(payment.getId());
//        System.out.println("결제 취소 완료: " + cancelled);
//
//        // 검증
//        assertEquals(PaymentStatus.CANCELLED, cancelled.getStatus());
//
//        // 주문 상태 검증
//        OrderDTO updatedOrder = orderService.getOrder(savedOrder.getId());
//        assertEquals(OrderStatus.CANCELLED, updatedOrder.getStatus());
//    }
//
//    @Test
//    @DisplayName("결제 조회 테스트")
//    void getPaymentTest() {
//        // 1. 장바구니에서 주문 생성
//        OrderDTO savedOrder = orderService.createOrderFromCart(1L, testOrderDTO);
//        testPaymentDTO.setOrderId(savedOrder.getId());
//
//        // 2. 결제 처리
//        PaymentDTO payment = paymentService.processPayment(testPaymentDTO);
//
//        // 3. 결제 조회
//        PaymentDTO found = paymentService.getPaymentByOrderId(savedOrder.getId());
//        System.out.println("조회된 결제 정보: " + found);
//
//        // 검증
//        assertNotNull(found);
//        assertEquals(payment.getId(), found.getId());
//        assertEquals(payment.getAmount(), found.getAmount());
//    }
//}