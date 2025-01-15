package com.green.jpa.repository.product;

import com.green.jpa.entity.product.Wishlist;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByMemberId(Long memberId);

    @Query("SELECT w FROM Wishlist w JOIN FETCH w.kit k LEFT JOIN FETCH k.images WHERE w.member.id = :memberId")
    List<Wishlist> findByMemberIdWithKit(@Param("memberId") Long memberId);

    @Query("SELECT COUNT(w) > 0 FROM Wishlist w " +
           "WHERE w.member.id = :memberId AND w.kit.id = :kitId")
    boolean existsByMemberIdAndKitId(@Param("memberId") Long memberId,
                                     @Param("kitId") Long kitId);

    int countByMemberId(Long memberId);

    @Modifying
    @Query("DELETE FROM Wishlist w " +
            "WHERE w.member.id = :memberId AND w.kit.id = :kitId")
    void deleteByMemberIdAndKitId(@Param("memberId") Long memberId,
                                  @Param("kitId") Long kitId);
}
