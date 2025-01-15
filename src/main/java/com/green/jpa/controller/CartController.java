package com.green.jpa.controller;

import com.green.jpa.dto.product.CartDTO;
import com.green.jpa.dto.product.CartItemDTO;
import com.green.jpa.dto.product.UniformCustomizationDTO;
import com.green.jpa.entity.product.PatchType;
import com.green.jpa.service.MemberService;
import com.green.jpa.service.product.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final MemberService memberService;
    // private final AuthService authService;

    // 임시로 memberId를 1L로 고정 시큐리티와 JWT토큰 입력시 memberId로 바꾸기

    @PostMapping("/{memberId}/items")
    public ResponseEntity<CartItemDTO> addCartItem( @PathVariable Long memberId, @RequestBody CartItemDTO cartItemDTO) {
        System.out.println("카트에 아이템이동 : " + cartItemDTO + " MemberId가 잘전달되는가? = " + memberId);
        CartItemDTO savedItem = cartService.addCartItem(memberId, cartItemDTO);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long memberId) {
        try {
            if (memberId == null) {
                return ResponseEntity.badRequest().build();
            }
            CartDTO cartDTO = cartService.getCart(memberId);
            log.info("Cart retrieved for member {}: {}", memberId, cartDTO);
            return ResponseEntity.ok(cartDTO);
        } catch (NumberFormatException e) {
            log.error("Invalid member ID format: {}", memberId);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error retrieving cart for member {}: {}", memberId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{memberId}/items/{itemId}/quantity")
    public ResponseEntity<CartItemDTO> updateQuantity(
            @PathVariable Long memberId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(memberId, itemId, request.get("quantity")));
    }

    @PatchMapping("{memberId}/items/{itemId}/size")
    public ResponseEntity<CartItemDTO> updateSize(
        @PathVariable Long memberId,
            @PathVariable Long itemId,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(cartService.updateCartItemSize(memberId, itemId, request.get("size")));
    }
//

    @DeleteMapping("{memberId}/items/{kitId}") // {memberId} 추가하기
    public ResponseEntity<?> deleteCartItem(
        @PathVariable Long memberId,
        @PathVariable Long kitId) { //     @PathVariable Long memberId, 멤버추가하기
        cartService.removeCartItem(memberId, kitId);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("{memberId}/items/{itemId}/patch")
    public ResponseEntity<CartItemDTO> updatePatch(
            @PathVariable Long memberId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> request) {
        String patchTypeStr = (String) request.get("patchType");
        PatchType patchType = patchTypeStr.isEmpty() ? null : PatchType.valueOf(patchTypeStr);
        boolean hasPatch = (boolean) request.get("hasPatch");
        return ResponseEntity.ok(cartService.updateCartItemPatch(memberId, itemId, patchType, hasPatch));
    }

    @PatchMapping("{memberId}/items/{itemId}/customization")
    public ResponseEntity<CartItemDTO> updateCustomization(
            @PathVariable Long memberId,
            @PathVariable Long itemId,
            @RequestBody UniformCustomizationDTO customization) {
        return ResponseEntity.ok(cartService.updateCartItemCustomization(memberId, itemId, customization));
    }

    @PatchMapping("{memberId}/items/{itemId}/name-number")
    public ResponseEntity<CartItemDTO> updateNameNumber(
            @PathVariable Long memberId,
            @PathVariable Long itemId,
            @RequestBody Map<String, String> request) {
        String customName = request.get("customName");
        String customNumber = request.get("customNumber");
        return ResponseEntity.ok(cartService.updateCartItemNameNumber(memberId, itemId, customName, customNumber));
    }
}