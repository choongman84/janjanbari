package com.green.jpa.repository.product;

import com.green.jpa.entity.product.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByPosition(String position);

    Optional<Player> findByNumber(String number);

    List<Player> findByKitId(Long kitId);

    @Query("SELECT p FROM Player p ORDER BY p.number")
    List<Player> findAllOrderByNumber();
}