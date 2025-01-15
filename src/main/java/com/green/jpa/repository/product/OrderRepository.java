package com.green.jpa.repository.product;

import com.green.jpa.entity.product.Order;
import com.green.jpa.entity.product.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    /*
    회원별 주문 조회
    상태별 주문 조회
    기간별 주문 조회
    주문 통계 (총액, 상태별 수량)
    미배송 주문 조회
     */
    List<Order> findByMemberId (Long memberId);

    // 주문 상태별 조회
    List<Order> findByStatus(OrderStatus status);

    // 특정 기간 내 주문 조회
    @Query("SELECT o FROM Order o " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "ORDER BY o.orderDate DESC")
    List<Order> findOrdersInPeriod(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    // 회원별, 상태별 주문 조회
    @Query("SELECT o FROM Order o " +
            "WHERE o.member.id = :memberId " +
            "AND o.status = :status " +
            "ORDER BY o.orderDate DESC")
    List<Order> findByMemberIdAndStatus(@Param("memberId") Long memberId,
                                        @Param("status") OrderStatus status);

    // 특정 회원의 최근 주문 조회 (limit)
    @Query("SELECT o FROM Order o " +
            "WHERE o.member.id = :memberId " +
            "ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByMember(@Param("memberId") Long memberId,
                                         Pageable pageable);

    // 특정 기간 내 총 주문 금액
    @Query("SELECT SUM(o.totalAmount) FROM Order o " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Integer calculateTotalAmountInPeriod(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);


    // 특정 금액 이상의 주문 조회
    @Query("SELECT o FROM Order o " +
            "WHERE o.totalAmount >= :amount " +
            "ORDER BY o.totalAmount DESC")
    List<Order> findOrdersAboveAmount(@Param("amount") int amount);

    // 미배송 주문 조회 (PENDING, PAID, PREPARING 상태)
    @Query("SELECT o FROM Order o " +
            "WHERE o.status IN ('PENDING', 'PAID', 'PREPARING') " +
            "ORDER BY o.orderDate ASC")
    List<Order> findUnshippedOrders();

    // 배송 완료된 주문 조회 (DELIVERED 상태)
    @Query("SELECT o FROM Order o WHERE o.status = 'DELIVERED' ORDER BY o.orderDate DESC")
    List<Order> findDeliveredOrders();
}