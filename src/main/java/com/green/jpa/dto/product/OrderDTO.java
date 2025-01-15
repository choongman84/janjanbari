package com.green.jpa.dto.product;

import com.green.jpa.dto.AddressDTO;
import com.green.jpa.entity.product.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
/*
 * 주문 정보 전달
 * 주문 생성, 조회에 사용
 * 용도:
 * - 주문 정보 요청/응답 통합 DTO
 * - 주문 생성, 조회, 상태 변경에 사용
 * - 주문 상품 목록 포함
 * 
 * 특징:
 * - 모든 필드 포함 (요청/응답 통합)
 * - validation 적용
 * - 배송 정보 포함
 */
public class OrderDTO {
    private Long id;
    private Long memberId;
    private List<OrderItemDTO> orderItems;
    @Min(value = 0, message = "총 주문금액은 0원 이상이어야 합니다")
    private int totalAmount;
    private OrderStatus status;
    @NotBlank(message = "수령인은 필수입니다")
    private String receiver;
    @NotBlank(message = "수령인 연락처는 필수입니다")
    private String receiverPhone;
    private AddressDTO address;
    private String deliveryMessage;
    private LocalDateTime orderDate;
    private LocalDateTime modifyDate;

    //주문자 정보의 배송지와 수신자 배송지 정보가 같다면?을 위한
    private boolean sameAsOrder;
}