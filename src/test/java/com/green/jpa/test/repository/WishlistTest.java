//package com.green.jpa.test.repository;
//
//import com.green.jpa.entity.Member;
//import com.green.jpa.entity.product.Kit;
//import com.green.jpa.entity.product.Wishlist;
//import com.green.jpa.repository.MemberRepository;
//import com.green.jpa.repository.product.KitRepository;
//import com.green.jpa.repository.product.WishlistRepository;
//import com.green.jpa.service.MemberService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.annotation.Rollback;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@SpringBootTest
//@Rollback(value = false)
//public class WishlistTest {
//
//    @Autowired
//    private MemberService memberRepository;
//
//    @Autowired
//    private KitRepository kitRepository;
//
//    @Autowired
//    private WishlistRepository wishlistRepository;
//
//    private static final Long TEMP_MEMBER_ID = 1L;
//
//
//    @Test
//    public void wishlistTest1(){
//        Member member = memberRepository.findById(TEMP_MEMBER_ID);
//        Kit kit = kitRepository.findById(9L)
//                .orElseThrow();
//        Wishlist wishlist = new Wishlist(
//                1L, member, kit, LocalDateTime.now()
//        );
//        wishlistRepository.save(wishlist);
//    }
//}
