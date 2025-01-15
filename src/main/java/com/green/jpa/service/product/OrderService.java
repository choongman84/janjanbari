package com.green.jpa.service.product;

import com.green.jpa.dto.AddressDTO;
import com.green.jpa.dto.product.KitDTO;
import com.green.jpa.dto.product.OrderDTO;
import com.green.jpa.dto.product.OrderItemDTO;
import com.green.jpa.entity.Address;
import com.green.jpa.entity.product.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public interface OrderService {
    // 주문 생성
    OrderDTO createOrderFromKit(Long memberId, KitDTO kitDTO);
    OrderDTO createOrderFromCart(Long memberId, OrderDTO orderDTO);
    
    // 주문 기본 CRUD
    OrderDTO getOrder(Long orderId);
    List<OrderDTO> getOrdersByMember(Long memberId);
    void cancelOrder(Long orderId);
    void updateOrderStatus(Long orderId, OrderStatus status);

    // 주문 검색
    List<OrderDTO> getOrdersByStatus(OrderStatus status);
    List<OrderDTO> getOrdersInPeriod(LocalDateTime startDate, LocalDateTime endDate);
    List<OrderDTO> getUnshippedOrders();
    List<OrderDTO> getHighValueOrders(int minAmount);
    List<OrderDTO> getRecentOrdersByMember(Long memberId, int limit);
    List<OrderDTO> getMemberOrdersByStatus(Long memberId, OrderStatus status);

    // 가격 계산
    int calculateUnitPrice(OrderItem orderItem);
    int calculateTotalPrice(OrderItem orderItem);
    int calculateCustomizationPrice(UniformCustomization customization);
    int calculateTotalAmount(LocalDateTime startDate, LocalDateTime endDate);
    
    // DTO 변환
    default OrderDTO toDto(Order order, UniformCustomizationService customizationService) {
        if (order == null) return null;

        return OrderDTO.builder()
                .id(order.getId())
                .memberId(order.getMember().getId())
                .orderItems(order.getOrderItems().stream()
                        .map(item -> toOrderItemDto(item, customizationService))
                        .collect(Collectors.toList()))
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .receiver(order.getReceiver())
                .receiverPhone(order.getReceiverPhone())
                .address(order.getAddress() != null ? 
                    new AddressDTO(
                        order.getAddress().getAddress(),
                        order.getAddress().getDetailAddress(),
                        order.getAddress().getZipcode()
                    ) : null)
                .deliveryMessage(order.getDeliveryMessage())
                .orderDate(order.getOrderDate())
                .modifyDate(order.getModifyDate())
                .build();
    }

    default Order toEntity(OrderDTO dto) {
        if (dto == null) return null;

        Order order = Order.builder()
                .totalAmount(dto.getTotalAmount())
                .status(dto.getStatus())
                .receiver(dto.getReceiver())
                .receiverPhone(dto.getReceiverPhone())
                .deliveryMessage(dto.getDeliveryMessage())
                .build();
                
        if (dto.getAddress() != null) {
            order.setAddress(new Address(
                dto.getAddress().getAddress(),
                dto.getAddress().getDetailAddress(),
                dto.getAddress().getZipcode()
            ));
        }
        
        return order;
    }

    default OrderItemDTO toOrderItemDto(OrderItem orderItem, UniformCustomizationService customizationService) {
        if (orderItem == null) return null;

        Kit kit = orderItem.getKit();
        return OrderItemDTO.builder()
                .id(orderItem.getId())
                .orderId(orderItem.getOrder().getId())
                .kitId(kit.getId())
                .kitName(kit.getName())
                .imageUrl(kit.getMainImage())
                .kitType(kit.getKitType())
                .gender(kit.getGender())
                .selectedSize(orderItem.getSelectedSize())
                .quantity(orderItem.getQuantity())
                .basePrice(orderItem.getBasePrice())
                .customization(orderItem.getCustomization() != null ? 
                    customizationService.toDto(orderItem.getCustomization()) : null)
                .totalPrice(calculateTotalPrice(orderItem))
                .build();
    }

    default OrderItem toOrderItemEntity(OrderItemDTO dto, UniformCustomizationService customizationService) {
        if (dto == null) return null;

        OrderItem orderItem = OrderItem.builder()
                .quantity(dto.getQuantity())
                .selectedSize(dto.getSelectedSize())
                .basePrice(dto.getBasePrice())
                .build();

        if (dto.getCustomization() != null) {
            orderItem.setCustomization(customizationService.toEntity(dto.getCustomization()));
        }

        return orderItem;
    }
}