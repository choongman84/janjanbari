package com.green.jpa.service.product;

import com.green.jpa.dto.AddressDTO;
import com.green.jpa.dto.product.CartDTO;
import com.green.jpa.dto.product.KitDTO;
import com.green.jpa.dto.product.OrderDTO;
import com.green.jpa.dto.product.OrderItemDTO;
import com.green.jpa.entity.Address;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.product.*;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.product.KitRepository;
import com.green.jpa.repository.product.OrderItemRepository;
import com.green.jpa.repository.product.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MemberRepository memberRepository;
    private final KitRepository kitRepository;
    private final CartService cartService;
    private final UniformCustomizationService customizationService;

    @Override
    @Transactional
    public OrderDTO createOrderFromKit(Long memberId, KitDTO kitDTO) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원이 존재하지 않습니다."));
        Kit kit = kitRepository.findById(kitDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        
        if (kit.getStock() < kitDTO.getStock()) {
            throw new IllegalStateException("재고가 부족합니다.");
        }

        Order order = Order.builder()
                .member(member)
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        OrderItem orderItem = toOrderItemEntity(OrderItemDTO.builder()
                .kitId(kit.getId())
                .quantity(kitDTO.getStock())
                .selectedSize(kitDTO.getSizes().iterator().next())
                .basePrice(kit.getPrice())
                .customization(kitDTO.getCustomization())
                .build(), customizationService);
        
        orderItem.setOrder(order);
        orderItem.setKit(kit);
        order.getOrderItems().add(orderItem);
        
        kit.decreaseStock(kitDTO.getStock());
        order.calculateTotalAmount();
        
        return toDto(orderRepository.save(order), customizationService);
    }

    @Override
    @Transactional
    public OrderDTO createOrderFromCart(Long memberId, OrderDTO orderDTO) {
        CartDTO cartDTO = cartService.getCart(memberId);
        Member member = getMember(memberId);

        if (orderDTO.isSameAsOrder()) {
            orderDTO.setReceiver(member.getName());
            orderDTO.setReceiverPhone(member.getPhone());
            orderDTO.setAddress(new AddressDTO(
                    member.getAddress().getAddress(),
                    member.getAddress().getDetailAddress(),
                    member.getAddress().getZipcode()));
        } else {
            validateDeliveryInfo(orderDTO);
        }

        // Order 생성
        Order order = Order.builder()
                .member(member)
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .orderItems(new ArrayList<>())
                .receiver(orderDTO.getReceiver())
                .receiverPhone(orderDTO.getReceiverPhone())
                .deliveryMessage(orderDTO.getDeliveryMessage())
                .build();

        // 주소 설정
        if (orderDTO.getAddress() != null) {
            order.setAddress(new Address(
                    orderDTO.getAddress().getAddress(),
                    orderDTO.getAddress().getDetailAddress(),
                    orderDTO.getAddress().getZipcode()));
        }

        // 장바구니 아이템을 주문 아이템으로 변환
        cartDTO.getCartItems().forEach(cartItem -> {
            Kit kit = getKit(cartItem.getKitId());
            validateStock(kit, cartItem.getQuantity());
            validateSize(kit, cartItem.getSize());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .kit(kit)
                    .quantity(cartItem.getQuantity())
                    .selectedSize(cartItem.getSize())
                    .basePrice(cartItem.getBasePrice())
                    .customization(customizationService.toEntity(cartItem.getCustomization()))
                    .build();

            order.getOrderItems().add(orderItem);
            kit.decreaseStock(cartItem.getQuantity());
        });

        // 주문 총액 계산 - 여기서 실제 계산
        order.calculateTotalAmount();

        // 계산된 총액이 orderDTO의 totalAmount와 일치하는지 검증
        if (order.getTotalAmount() != orderDTO.getTotalAmount()) {
            throw new IllegalArgumentException(
                    String.format("주문 금액이 일치하지 않습니다. 예상: %d, 실제: %d",
                            orderDTO.getTotalAmount(), order.getTotalAmount()));
        }

        Order savedOrder = orderRepository.save(order);

        // 장바구니 비우기
        cartService.clearCart(memberId);

        return toDto(savedOrder, customizationService);
    }


    @Override
    public OrderDTO getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문이 존재하지 않습니다."));
        return toDto(order, customizationService);
    }

    @Override
    public List<OrderDTO> getOrdersByMember(Long memberId) {
        return orderRepository.findByMemberId(memberId).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문이 존재하지 않습니다."));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("취소할 수 없는 주문 상태입니다.");
        }
        
        order.getOrderItems().forEach(item -> {
            Kit kit = item.getKit();
            kit.increaseStock(item.getQuantity());
        });
        
        order.setStatus(OrderStatus.CANCELLED);
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문이 존재하지 않습니다."));
        order.setStatus(status);
    }

    @Override
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersInPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findOrdersInPeriod(startDate, endDate).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getUnshippedOrders() {
        return orderRepository.findUnshippedOrders().stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getHighValueOrders(int minAmount) {
        return orderRepository.findOrdersAboveAmount(minAmount).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getRecentOrdersByMember(Long memberId, int limit) {
        return orderRepository.findRecentOrdersByMember(memberId, PageRequest.of(0, limit)).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getMemberOrdersByStatus(Long memberId, OrderStatus status) {
        return orderRepository.findByMemberIdAndStatus(memberId, status).stream()
                .map(order -> toDto(order, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    public int calculateUnitPrice(OrderItem orderItem) {
        int basePrice = orderItem.getBasePrice();
        int customizationPrice = orderItem.getCustomization() != null ? 
            calculateCustomizationPrice(orderItem.getCustomization()) : 0;
        return basePrice + customizationPrice;
    }

    @Override
    public int calculateTotalPrice(OrderItem orderItem) {
        return calculateUnitPrice(orderItem) * orderItem.getQuantity();
    }

    @Override
    public int calculateCustomizationPrice(UniformCustomization customization) {
        if (customization == null) return 0;
        return customization.getTotalCustomPrice();
    }

    @Override
    public int calculateTotalAmount(LocalDateTime startDate, LocalDateTime endDate) {
        Integer total = orderRepository.calculateTotalAmountInPeriod(startDate, endDate);
        return total != null ? total : 0;
    }

    private void validateOrderItems(List<OrderItem> orderItems) {
        orderItems.forEach(item -> {
            if (item.getQuantity() < 1) {
                throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
            }
            if (item.getKit().getStock() < item.getQuantity()) {
                throw new IllegalStateException("재고가 부족합니다: " + item.getKit().getName());
            }
        });
    }

    private void updateKitStock(Kit kit, int quantity) {
        if (kit.getStock() < quantity) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        kit.decreaseStock(quantity);
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원이 존재하지 않습니다."));
    }

    private Kit getKit(Long kitId) {
        return kitRepository.findById(kitId)
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
    }

    private void validateStock(Kit kit, int quantity) {
        if (kit.getStock() < quantity) {
            throw new IllegalStateException("재고가 부족합니다: " + kit.getName());
        }
    }

    private void validateSize(Kit kit, String size) {
        if (!kit.hasSize(size)) {
            throw new IllegalArgumentException("유효하지 않은 사이즈입니다: " + size);

        }
    }
    private void validateDeliveryInfo(OrderDTO orderDTO) {
        // 배송지 정보 필수 항목 검증
        if (orderDTO.getReceiver() == null || orderDTO.getReceiver().isEmpty()) {
            throw new IllegalArgumentException("받는 사람 이름은 필수 입력 항목입니다.");
        }

        if (orderDTO.getReceiverPhone() == null || !isValidPhoneNumber(orderDTO.getReceiverPhone())) {
            throw new IllegalArgumentException("올바른 연락처를 입력해주세요.");
        }

        AddressDTO address = orderDTO.getAddress();
        if (address == null) {
            throw new IllegalArgumentException("배송 주소 정보가 필요합니다.");
        }

        if (address.getAddress() == null || address.getAddress().isEmpty()) {
            throw new IllegalArgumentException("배송 주소는 필수 입력 항목입니다.");
        }

        if (address.getDetailAddress() == null || address.getDetailAddress().isEmpty()) {
            throw new IllegalArgumentException("상세 주소는 필수 입력 항목입니다.");
        }

        if (address.getZipcode() == null || !isValidZipcode(address.getZipcode())) {
            throw new IllegalArgumentException("올바른 우편번호를 입력해주세요.");
        }

    }

    // 연락처 유효성 검사 (정규식 기반)
    private boolean isValidPhoneNumber(String phone) {
        String phoneRegex = "^(010|011|016|017|018|019)\\d{3,4}\\d{4}$";
        return phone.matches(phoneRegex);
    }

    // 우편번호 유효성 검사
    private boolean isValidZipcode(String zipcode) {
        String zipcodeRegex = "^\\d{5}$"; // 우편번호는 5자리 숫자
        return zipcode.matches(zipcodeRegex);
    }


}
