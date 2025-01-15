package com.green.jpa.service.product;

import com.green.jpa.dto.product.WishlistDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.product.Kit;
import com.green.jpa.entity.product.Wishlist;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.product.KitRepository;
import com.green.jpa.repository.product.WishlistRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MemberRepository memberRepository;
    private final KitRepository kitRepository;
//    private static final Long MEMBER_ID = 1L;
    @Override
    @Transactional
    public WishlistDTO addWishlist(Long memberId, Long kitId) {
        System.out.println("서비스에서 위시리스트 추가 = " + memberId + "," + kitId);
        if(isWishlist(memberId, kitId)) {
            removeWishlist(memberId, kitId);
            return null;
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다."));
        Kit kit = kitRepository.findById(kitId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));

        Wishlist wishlist = toEntity(member, kit);
        wishlistRepository.save(wishlist);
        return toDto(wishlist);
    }

    @Override
    @Transactional
    public void removeWishlist(Long memberId, Long kitId) {
        System.out.println("서비스에서 위시리스트 제거 = " + memberId + "," + kitId);
        wishlistRepository.deleteByMemberIdAndKitId(memberId, kitId);
    }

    @Override
    public List<WishlistDTO> getWishlist(Long memberId) {
        System.out.println("서비스에서 위시리스트 조회 + 멤버ID = " + memberId);
        return wishlistRepository.findByMemberIdWithKit(memberId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isWishlist(Long memberId, Long kitId) {
        System.out.println("서비스에서 멤버id, 키트id 요청 = " + memberId + "," + kitId);
        return wishlistRepository.existsByMemberIdAndKitId(memberId, kitId);
    }
}
