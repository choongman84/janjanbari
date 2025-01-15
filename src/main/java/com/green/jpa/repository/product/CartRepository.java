package com.green.jpa.repository.product;

import com.green.jpa.entity.Member;
import com.green.jpa.entity.product.Cart;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
       Optional<Cart> findByMember(Member member);
    // 회원 장바구니 조회
    Optional<Cart> findByMemberId(Long memberId);
    //장바구니 존재 여부 확인
    boolean existsByMemberId(Long memberId);
    //장바구니 총 금액 조회

    //회원별 장바구니 아이템 수 조회
    @Query("SELECT COUNT(ci) FROM Cart c JOIN c.cartItems ci WHERE c.member.id = :memberId")
    Integer countCartItems(@Param("memberId")Long memberId);

    @Query("SELECT DISTINCT c FROM Cart c " +
           "LEFT JOIN FETCH c.cartItems ci " +
           "LEFT JOIN FETCH ci.kit " +
           "LEFT JOIN FETCH ci.customization " +
           "WHERE c.member.id = :memberId")
    Optional<Cart> findByMemberIdWithItems(@Param("memberId") Long memberId);

    @Query("SELECT COALESCE(SUM(ci.quantity * ci.kit.price), 0) " +
           "FROM Cart c JOIN c.cartItems ci " +
           "WHERE c.member.id = :memberId")
    Integer calculateCartTotal(@Param("memberId") Long memberId);
}
