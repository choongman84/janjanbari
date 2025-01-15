package com.green.jpa.repository.product;

import com.green.jpa.entity.product.Gender;
import com.green.jpa.entity.product.Kit;
import com.green.jpa.entity.product.KitType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KitRepository extends JpaRepository<Kit, Long> {
    // 기본 검색
    List<Kit> findByKitType(KitType kitType);

    List<Kit> findByGender(Gender gender);

    List<Kit> findBySeason(String season);

    // 복합 조건 검색
    @Query("SELECT k FROM Kit k " +
            "WHERE k.kitType = :kitType " +
            "AND k.gender = :gender")
    List<Kit> findByKitTypeAndGender(@Param("kitType") KitType kitType,
                                     @Param("gender") Gender gender);

    // 가격 범위 검색
    @Query("SELECT k FROM Kit k WHERE k.price BETWEEN :minPrice AND :maxPrice")
    List<Kit> findByPriceRange(@Param("minPrice") int minPrice,
                               @Param("maxPrice") int maxPrice);

    // 재고 검색
    @Query("SELECT k FROM Kit k WHERE k.stock > :stock")
    List<Kit> findByStockGreaterThan(@Param("stock") int stock);

    // 이름 검색 (포함)
    @Query("SELECT k FROM Kit k WHERE k.name LIKE %:name%")
    List<Kit> findByNameContaining(@Param("name") String name);

    // 동적 검색 조건
    @Query("SELECT k FROM Kit k " +
            "WHERE (:kitType is null OR k.kitType = :kitType) " +
            "AND (:gender is null OR k.gender = :gender) " +
            "AND (:season is null OR k.season = :season) " +
            "AND (:minPrice is null OR k.price >= :minPrice) " +
            "AND (:maxPrice is null OR k.price <= :maxPrice) " +
            "AND k.stock > 0 " +
            "ORDER BY k.createDate DESC")
    List<Kit> searchKits(@Param("kitType") KitType kitType,
                         @Param("gender") Gender gender,
                         @Param("season") String season,
                         @Param("minPrice") Integer minPrice,
                         @Param("maxPrice") Integer maxPrice);

    // 재고 부족 상품 조회
    @Query("SELECT k FROM Kit k WHERE k.stock <= :stockLimit")
    List<Kit> findLowStockKits(@Param("stockLimit") int stockLimit);

    // 최근 등록된 상품 조회
    @Query("SELECT k FROM Kit k ORDER BY k.createDate DESC")
    List<Kit> findRecentKits(Pageable pageable);

    @Query("SELECT k FROM Kit k LEFT JOIN FETCH k.images WHERE k.kitType = :kitType")
    List<Kit> findByKitTypeWithImages(@Param("kitType") KitType kitType);

    @Query("SELECT k FROM Kit k LEFT JOIN FETCH k.images")
    Page<Kit> findAllWithImages(Pageable pageable);
}
