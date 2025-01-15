package com.green.jpa.service.product;

import com.green.jpa.dto.product.CartDTO;
import com.green.jpa.dto.product.CartItemDTO;
import com.green.jpa.dto.product.UniformCustomizationDTO;
import com.green.jpa.entity.product.Cart;
import com.green.jpa.entity.product.CartItem;
import com.green.jpa.entity.product.PatchType;

import java.util.List;
import java.util.stream.Collectors;

public interface CartService {
        // 장바구니 CRUD
        CartDTO getCart(Long memberId);

        void clearCart(Long memberId);

        // 장바구니 상품 CRUD
        CartItemDTO addCartItem(Long memberId, CartItemDTO dto);

        CartItemDTO getCartItem(Long memberId, Long kitId);

        List<CartItemDTO> getCartItems(Long memberId);

        CartItemDTO updateCartItemQuantity(Long memberId, Long kitId, int quantity);

        CartItemDTO updateCartItemSize(Long memberId, Long kitId, String size);

        void removeCartItem(Long memberId, Long kitId);

        // 검증 로직
        boolean validateQuantity(Long kitId, int quantity);

        boolean validateSize(Long kitId, String size);

        // 가격 계산
        int calculateItemPrice(CartItem item);

        int calculateTotalAmount(List<CartItemDTO> items);

        // 커스터마이징 관련 메서드 추가
        CartItemDTO updateCartItemCustomization(Long memberId, Long kitId, UniformCustomizationDTO customization);

        CartItemDTO updateCartItemPatch(Long memberId, Long kitId, PatchType patchType, boolean hasPatch);

        CartItemDTO updateCartItemNameNumber(Long memberId, Long kitId, String customName, String customNumber);

        // DTO 변환 (default 메서드)
        default CartDTO toDto(Cart cart, UniformCustomizationService customizationService) {
                if (cart == null) return null;
                
                List<CartItemDTO> items = cart.getCartItems().stream()
                                .map(item -> toCartItemDto(item, customizationService))
                                .collect(Collectors.toList());
                
                int totalAmount = items.stream()
                                .mapToInt(CartItemDTO::getTotalPrice)
                                .sum();
                
                return CartDTO.builder()
                                .id(cart.getId())
                                .memberId(cart.getMember().getId())
                                .cartItems(items)
                                .totalAmount(totalAmount)
                                .build();
        }

        default CartItemDTO toCartItemDto(CartItem item, UniformCustomizationService customizationService) {
                if (item == null) return null;
                
                UniformCustomizationDTO customizationDTO = customizationService.toDto(item.getCustomization());
                
                CartItemDTO dto = CartItemDTO.builder()
                        .id(item.getId())
                        .kitId(item.getKit().getId())
                        .kitName(item.getKit().getName())
                        .imgUrl(item.getKit().getMainImage())
                        .quantity(item.getQuantity())
                        .size(item.getSelectedSize())
                        .basePrice(item.getKit().getPrice())
                        .customization(customizationDTO)
                        .build();
                
                dto.calculateTotalPrice();
                return dto;
        }


}
