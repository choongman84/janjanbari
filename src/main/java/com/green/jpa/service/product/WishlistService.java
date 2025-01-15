package com.green.jpa.service.product;

import com.green.jpa.dto.product.WishlistDTO;
import com.green.jpa.entity.product.Wishlist;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.product.Kit;


import java.util.List;

public interface WishlistService {
    WishlistDTO addWishlist(Long memberId, Long kitId);
    void removeWishlist(Long memberId, Long kitId);
    List<WishlistDTO> getWishlist(Long memberId);
    boolean isWishlist(Long memberId, Long kitId);

    default WishlistDTO toDto(Wishlist wishlist) {
        if (wishlist == null) return null;
        Kit kit = wishlist.getKit();

        return WishlistDTO.builder()
                .id(wishlist.getId())
                .memberId(wishlist.getMember().getId())
                .kitId(kit.getId())
                .kitName(kit.getName())
                .imageUrl(kit.getMainImage())
                .price(kit.getPrice())
                .kitType(kit.getKitType())
                .gender(kit.getGender())
                .createDate(wishlist.getCreateDate())
                .build();
    }

    default Wishlist toEntity(Member member, Kit kit) {
        return Wishlist.builder()
                .member(member)
                .kit(kit)
                .build();
    }
}
