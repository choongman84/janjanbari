//package com.green.jpa.test.repository;
//
//import com.green.jpa.dto.product.*;
//import com.green.jpa.entity.product.PatchType;
//import com.green.jpa.service.product.OrderService;
//import jakarta.transaction.Transactional;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@SpringBootTest
//public class OrderDummyTest {
//    @Autowired
//    private OrderService orderService;
//
//    @Test
//    public void createOrderTest() {
//        // given
//        List<OrderItemCreateDTO> items = new ArrayList<>();
//        UniformCustomizationDTO customization = UniformCustomizationDTO.builder()
//                .playerName("손흥민")
//                .number("7")
//                .patch(true)
//                .patchType(PatchType.UCL)
//                .build();
//
//        OrderItemCreateDTO item = OrderItemCreateDTO.builder()
//                .kitId(1L)
//                .selectedSize("L")
//                .quantity(1)
//                .customization(customization)
//                .build();
//
//        items.add(item);
//
//        OrderCreateDTO orderCreateDTO = OrderCreateDTO.builder()
//                .memberId(1L)
//                .recipientName("이충만")
//                .phone("010-1234-5678")
//                .address("서울시 강남구")
//                .items(items)
//                .build();
//
//        // when
//        OrderDTO createdOrder = orderService.createOrder(orderCreateDTO);
//
//        // then
//        System.out.println("생성된 주문 ID: " + createdOrder.getId());
//        System.out.println("주문 상태: " + createdOrder.getStatus());
//        System.out.println("총 금액: " + createdOrder.getTotalAmount());
//    }
//
//    @Test
//    public void OrderCancelTest() {
//        // given
//        Long orderId = 1L; // 테스트할 주문 ID
//
//        // when
//        orderService.cancelOrder(orderId);
//        OrderDTO canceledOrder = orderService.getOrder(orderId);
//
//        // then
//        System.out.println("취소된 주문 ID: " + canceledOrder.getId());
//        System.out.println("주문 상태: " + canceledOrder.getStatus());
//    }
//
//    @Test
//    public void getOrderListWhenOfDateTest() {
//        // given
//        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
//        LocalDateTime endDate = LocalDateTime.now();
//
//        // when
//        List<OrderDTO> orders = orderService.getOrdersInPeriod(startDate, endDate);
//
//        // then
//        System.out.println("조회된 주문 수: " + orders.size());
//        orders.forEach(order -> {
//            System.out.println("주문 ID: " + order.getId());
//            System.out.println("주문 일시: " + order.getOrderDate());
//            System.out.println("주문 상태: " + order.getStatus());
//            System.out.println("--------------------");
//        });
//    }
//}
