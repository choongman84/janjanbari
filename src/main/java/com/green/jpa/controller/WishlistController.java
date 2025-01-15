package com.green.jpa.controller;

import com.green.jpa.dto.product.WishlistDTO;
import com.green.jpa.service.product.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor

public class WishlistController {

    private final WishlistService wishlistService;
    private static final Long TEMP_MEMBER_ID = 1L; // 임시 멤버 ID
//    @PostMapping("{memberId}/{kitId}")
//    public ResponseEntity<?> toggleWishlist(
//            @PathVariable Long memberId,
//            @PathVariable Long kitId){
//       WishlistDTO result = wishlistService.addWishlist(memberId, kitId);
//       if(result == null){
//           return ResponseEntity.noContent().build();
//       }
//       return ResponseEntity.ok(result);
//    }
//
//    @GetMapping("/{memberId}")
//    public ResponseEntity<List<WishlistDTO>> getWishlist(@PathVariable Long memberId){
//        return ResponseEntity.ok(wishlistService.getWishlist(memberId));
//    }
//    @GetMapping("/{memberId}/{kitId}/check")
//    public ResponseEntity<Boolean> isWishlist(
//            @PathVariable Long memberId,
//            @PathVariable Long kitId){
//        return ResponseEntity.ok(wishlistService.isWishlist(memberId,kitId));
//    }
    // 임시로 쓸 Wishlist 메서드 memberid 추가되면 삭제 하기

@PostMapping("/{kitId}")
public ResponseEntity<?> toggleWishlist(@PathVariable Long kitId) {
    try {
        WishlistDTO result = wishlistService.addWishlist(TEMP_MEMBER_ID, kitId);
        if (result == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@GetMapping("/{kitId}/check")
public ResponseEntity<Boolean> isWishlist(@PathVariable Long kitId) {
    System.out.println("컨트롤러에서 위시리스트 체크 Boolean  = " + kitId);
    try {
        boolean result = wishlistService.isWishlist(TEMP_MEMBER_ID, kitId);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.ok(false);
    }
}

@GetMapping
public ResponseEntity<List<WishlistDTO>> getWishlist() {
    try {
        return ResponseEntity.ok(wishlistService.getWishlist(TEMP_MEMBER_ID));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Collections.emptyList());
    }
}
}