package com.green.jpa.entity.product;

import com.green.jpa.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/*
연관관계:
- Member(N:1): 단방향 관계 (Wishlist -> Member)
  - 찜은 반드시 회원 정보가 필요
  - 회원의 찜 목록은 별도 쿼리로 조회

- Kit(N:1): 양방향 관계 (Wishlist <-> Kit)
  - 찜은 상품 정보가 필요
  - 상품의 찜 횟수 통계를 위해 양방향 유지

특징:
- 회원의 찜 정보 관리
- 동일 상품 중복 찜 방지 (unique constraint)
- 생성 시간 자동 기록
- 인기 상품 집계에 활용

장점:
- 중복 찜 방지로 데이터 정합성 보장
- 상품별 찜 횟수 집계 용이
- 간단한 구조로 관리 용이
*/

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(uniqueConstraints = {
        @UniqueConstraint(
                name = "wishlist_member_kit",
                columnNames = {"member_id", "kit_id"}
        )
})
public class Wishlist {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kit_id",nullable = false)
    private Kit kit;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createDate;

}
