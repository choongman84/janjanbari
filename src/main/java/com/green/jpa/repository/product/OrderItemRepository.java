package com.green.jpa.repository.product;

import com.green.jpa.entity.product.OrderItem;
import com.green.jpa.entity.product.UniformCustomization;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    /*
    주문별/키트별 아이템 조회
    판매량 통계 (총 판매량, 기간별, 사이즈별)
    커스터마이징 관련 조회
    베스트셀러 조회
    주문 금액 계산
     */
    // 주문별 아이템 조회
    List<OrderItem> findByOrderId(Long orderId);

    // 특정 키트의 주문 아이템 조회
    List<OrderItem> findByKitId(Long kitId);

    // 특정 주문아이템 찾기
    Optional<OrderItem> findByOrderIdAndId(Long orderId, Long orderItemId);

    // 특정 키트의 총 판매량 조회
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi " +
            "WHERE oi.kit.id = :kitId")
    Integer getTotalSalesQuantityByKit(@Param("kitId") Long kitId);


    // 커스터마이징이 포함된 주문 아이템 조회
    @Query("SELECT oi FROM OrderItem oi " +
            "WHERE oi.customization IS NOT NULL " +
            "AND oi.order.id = :orderId")
    List<OrderItem> findCustomizedItems(@Param("orderId") Long orderId);


    // 특정 주문의 커스터마이징 정보 조회
    @Query("SELECT oi.customization FROM OrderItem oi " +
            "WHERE oi.order.id = :orderId " +
            "AND oi.customization IS NOT NULL")
    List<UniformCustomization> findCustomizationsByOrder(@Param("orderId") Long orderId);

    @Query("SELECT SUM(oi.basePrice * oi.quantity) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Integer calculateOrderTotal(@Param("orderId") Long orderId);
}