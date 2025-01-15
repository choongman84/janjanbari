package com.green.jpa.controller;

import com.green.jpa.dto.product.KitDTO;
import com.green.jpa.dto.product.OrderDTO;
import com.green.jpa.entity.product.OrderStatus;
import com.green.jpa.service.product.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 임시로 memberId를 1L로 고정
    private static final Long TEMP_MEMBER_ID = 1L;

    // 단일 상품 주문
    @PostMapping("/kits")
    public ResponseEntity<OrderDTO> createOrderFromKit(@RequestBody KitDTO kitDTO) {
        return ResponseEntity.ok(orderService.createOrderFromKit(TEMP_MEMBER_ID, kitDTO));
    }

    // 장바구니 전체 주문
    @PostMapping("/cart")
    public ResponseEntity<?> createOrderFromCart(@RequestBody OrderDTO orderDTO) {
        // 1128 예외 처리 Try-Catch구문 추가
        try{
            orderService.createOrderFromCart(TEMP_MEMBER_ID, orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("주문 생성 성공");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("주문 생성 실패");
        }
//        return ResponseEntity.ok(orderService.createOrderFromCart(TEMP_MEMBER_ID, orderDTO));
    }

    // 주문 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    // 회원별 주문 목록
    @GetMapping("/member")
    public ResponseEntity<List<OrderDTO>> getMemberOrders() {
        return ResponseEntity.ok(orderService.getOrdersByMember(TEMP_MEMBER_ID));
    }

    // 주문 취소
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }

    // 주문 상태 변경
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok().build();
    }

    // 상태별 주문 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    // 기간별 주문 조회
    @GetMapping("/period")
    public ResponseEntity<List<OrderDTO>> getOrdersInPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getOrdersInPeriod(startDate, endDate));
    }

    // 미배송 주문 조회
    @GetMapping("/unshipped")
    public ResponseEntity<List<OrderDTO>> getUnshippedOrders() {
        return ResponseEntity.ok(orderService.getUnshippedOrders());
    }

    // 고액 주문 조회
    @GetMapping("/high-value")
    public ResponseEntity<List<OrderDTO>> getHighValueOrders(
            @RequestParam(defaultValue = "100000") int minAmount) {
        return ResponseEntity.ok(orderService.getHighValueOrders(minAmount));
    }

    // 회원별 최근 주문
    @GetMapping("/recent")
    public ResponseEntity<List<OrderDTO>> getRecentMemberOrders(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(orderService.getRecentOrdersByMember(TEMP_MEMBER_ID, limit));
    }

    // 회원별 상태별 주문
    @GetMapping("/member/{memberId}/status/{status}")
    public ResponseEntity<List<OrderDTO>> getMemberOrdersByStatus(
            @PathVariable Long memberId,  // memberId를 경로에서 받음
            @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getMemberOrdersByStatus(memberId, status));
    }
    
//    @PostMapping("/{orderId}/payment")
//    public ResponseEntity<?> processPayment(
//            @PathVariable Long orderId,
//            @RequestBody PaymentDTO paymentDTO) {
//        try {
//            OrderDTO result = orderService.processPayment(orderId, paymentDTO);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    
    // // 단일 상품 주문 엔드포인트 수정
    // @PostMapping("/kit/{memberId}") // /kit -> /kit/{memberId}
    // public ResponseEntity<OrderDTO> createOrderFromKit(
    //         @PathVariable Long memberId,
    //         @RequestBody KitDTO kitDTO) {
    //     return ResponseEntity.ok(orderService.createOrderFromKit(memberId, kitDTO));
    // }

    // // 장바구니 주문 엔드포인트 수정
    // @PostMapping("/cart/{memberId}") // /cart -> /cart/{memberId}
    // public ResponseEntity<?> createOrderFromCart(
    //         @PathVariable Long memberId,
    //         @RequestBody OrderDTO orderDTO) {
    //     try {
    //         OrderDTO result = orderService.createOrderFromCart(memberId, orderDTO);
    //         return ResponseEntity.status(HttpStatus.CREATED).body(result);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
}