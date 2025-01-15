package com.green.jpa.service.product;

import com.green.jpa.dto.product.CartDTO;
import com.green.jpa.dto.product.CartItemDTO;
import com.green.jpa.dto.product.UniformCustomizationDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.product.*;
import com.green.jpa.exception.OutOfStockException;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.product.CartItemRepository;
import com.green.jpa.repository.product.CartRepository;
import com.green.jpa.repository.product.KitRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final KitRepository kitRepository;
    private final MemberRepository memberRepository;
    private final UniformCustomizationService customizationService;


    @Override
    public CartDTO getCart(Long memberId) {
        Cart cart = cartRepository.findByMemberIdWithItems(memberId)
                .orElseGet(() -> {
                    Member member = memberRepository.findById(memberId)
                            .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));
                    return cartRepository.save(Cart.builder().member(member).build());
                });
        
        return toDto(cart, customizationService);
    }

    @Override
    @Transactional
    public CartItemDTO addCartItem(Long memberId, CartItemDTO dto) {
        Kit kit = validateAndGetKit(dto.getKitId(), dto.getQuantity());
        Cart cart = getOrCreateCart(memberId);
        
        UniformCustomization customization = UniformCustomization.builder()
                .customType(dto.getCustomization().getType())
                .patch(dto.getCustomization().isPatch())
                .patchType(dto.getCustomization().getPatchType())
                .hasPlayerName(dto.getCustomization().isHasPlayerName())
                .playerName(dto.getCustomization().getPlayerName())
                .playerNumber(dto.getCustomization().getPlayerNumber())
                .customName(dto.getCustomization().getCustomName())
                .customNumber(dto.getCustomization().getCustomNumber())
                .build();
        
        customization.calculatePrices(); // 가격 계산
        
        CartItem cartItem = CartItem.builder()
                .kit(kit)
                .cart(cart)
                .quantity(dto.getQuantity())
                .selectedSize(dto.getSize())
                .customization(customization)
                .build();
                
        cart.addCartItem(cartItem);
        cartItemRepository.save(cartItem);
        
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    public void clearCart(Long memberId) {
    Cart cart = cartRepository.findByMemberId(memberId)
            .orElseThrow(() -> new EntityNotFoundException("장바구니에 상품이 없습니다."));
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public CartItemDTO getCartItem(Long memberId, Long kitId) {
        CartItem cartItem = findCartItem(memberId, kitId);
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    public List<CartItemDTO> getCartItems(Long memberId) {
        Cart cart = cartRepository.findByMemberIdWithItems(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        return cart.getCartItems().stream()
                .map(item -> toCartItemDto(item, customizationService))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemQuantity(Long memberId, Long kitId, int quantity) {
        if(quantity < 1){
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        CartItem cartItem = cartItemRepository.findByCartIdAndKitId(cart.getId(), kitId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        if(!validateQuantity(kitId, quantity)){
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        cartItem.changeQuantity(quantity);
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemSize(Long memberId, Long kitId, String size) {
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        
        CartItem cartItem = cartItemRepository.findByCartIdAndKitId(cart.getId(), kitId)
                .orElseThrow(() -> new EntityNotFoundException("해당 상품이 장바구니에 없습니다."));
        
        if (!validateSize(kitId, size)) {
            throw new IllegalArgumentException("유효하지 않은 사이즈입니다.");
        }
        
        cartItem.setSelectedSize(size);
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    @Transactional
    public void removeCartItem(Long memberId, Long kitId) {
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        cartItemRepository.deleteByCartIdAndKitId(cart.getId(), kitId);
    }

    @Override
    public boolean validateQuantity(Long kitId, int quantity) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        return kit.getStock() >= quantity;
    }

    @Override
    public int calculateItemPrice(CartItem item) {
        int basePrice = item.getKit().getPrice();
        int customizationPrice = 0;
        
        if (item.getCustomization() != null) {
            customizationPrice = item.getCustomization().getTotalCustomPrice();
        }
        
        return (basePrice + customizationPrice) * item.getQuantity();
    }

    @Override
    public int calculateTotalAmount(List<CartItemDTO> items) {
        return items.stream()
                .mapToInt(CartItemDTO::getTotalPrice)
                .sum();
    }

    @Override
    public boolean validateSize(Long kitId, String size) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        return kit.hasSize(size);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemCustomization(Long memberId, Long kitId, UniformCustomizationDTO customization) {
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        
        CartItem cartItem = cartItemRepository.findByCartIdAndKitId(cart.getId(), kitId)
                .orElseThrow(() -> new EntityNotFoundException("해당 상품이 장바구니에 없습니다."));
        
        customizationService.validateCustomization(customization);
        cartItem.setCustomization(customizationService.toEntity(customization));
        
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemPatch(Long memberId, Long kitId, PatchType patchType, boolean hasPatch) {
        CartItem cartItem = findCartItem(memberId, kitId);
        UniformCustomization customization = cartItem.getCustomization();
        
        if (customization == null) {
            customization = UniformCustomization.builder()
                    .customType("none")
                    .patch(hasPatch)
                    .patchType(patchType)
                    .build();
        } else {
            customization.setPatch(hasPatch);
            customization.setPatchType(patchType);
        }
        
        customization.calculatePrices();
        cartItem.setCustomization(customization);
        
        return toCartItemDto(cartItem, customizationService);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemNameNumber(Long memberId, Long kitId, String customName, String customNumber) {
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));
        
        CartItem cartItem = cartItemRepository.findByCartIdAndKitId(cart.getId(), kitId)
                .orElseThrow(() -> new EntityNotFoundException("해당 상품이 장바구니에 없습니다."));
        
        UniformCustomization customization = cartItem.getCustomization();
        if (customization == null) {
            customization = UniformCustomization.builder()
                    .hasPlayerName(true)
                    .customName(customName)
                    .customNumber(customNumber)
                    .build();
        } else {
            customization.setHasPlayerName(true);
            customization.setCustomName(customName);
            customization.setCustomNumber(customNumber);
        }
        
        cartItem.setCustomization(customization);
        return toCartItemDto(cartItem, customizationService);
    }

    private Cart getOrCreateCart(Long memberId) {
        return cartRepository.findByMemberId(memberId)
                .orElseGet(() -> {
                    Member member = memberRepository.findById(memberId)
                            .orElseThrow(() -> new EntityNotFoundException("회원이 존재하지 않습니다."));
                    return cartRepository.save(Cart.builder().member(member).build());
                });
    }

    private Kit validateAndGetKit(Long kitId, int quantity) {
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        if (!validateQuantity(kitId, quantity)) {
            throw new IllegalArgumentException("재고가 부족합니다.");
        }
        return kit;
    }

    private CartItem findCartItem(Long memberId, Long kitId) {
        Cart cart = cartRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 비어있습니다."));

        return cartItemRepository.findByCartIdAndKitId(cart.getId(), kitId)
                .orElseThrow(() -> new EntityNotFoundException("해당 상품이 장바구니에 없습니다."));
    }
}
