package com.green.jpa.repository.product;

import com.green.jpa.entity.product.CartItem;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId")
  List<CartItem> findByCartId(@Param("cartId") Long cartId);

  @Query("SELECT ci FROM CartItem ci " +
         "JOIN FETCH ci.kit k " +
         "LEFT JOIN FETCH ci.customization " +
         "WHERE ci.cart.id = :cartId AND k.id = :kitId")
  Optional<CartItem> findByCartIdAndKitId(@Param("cartId") Long cartId, 
                                         @Param("kitId") Long kitId);

  @Query("SELECT ci FROM CartItem ci " +
         "WHERE ci.cart.id = :cartId AND ci.kit.id = :kitId " +
         "AND ci.selectedSize = :size")
  Optional<CartItem> findByCartIdAndKitIdAndSize(@Param("cartId") Long cartId, 
                                                  @Param("kitId") Long kitId,
                                                  @Param("size") String size);

  @Query("SELECT COALESCE(SUM(ci.quantity * ci.kit.price), 0) " +
         "FROM CartItem ci WHERE ci.cart.id = :cartId")
  Integer calculateCartItemsTotal(@Param("cartId") Long cartId);

  @Modifying
  @Transactional
  @Query("DELETE FROM CartItem ci WHERE ci.cart.member.id = :memberId AND ci.kit.id = :kitId")
  void deleteByCartIdAndKitId(@Param("memberId") Long memberId, @Param("kitId") Long kitId);
}
