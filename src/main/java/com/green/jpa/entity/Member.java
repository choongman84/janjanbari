package com.green.jpa.entity;

import com.green.jpa.entity.product.Cart;
import com.green.jpa.entity.product.Order;
import com.green.jpa.entity.product.Wishlist;
import jakarta.persistence.*;
import lombok.*;
import org.apache.ibatis.annotations.One;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
@ToString(exclude = {"orders","cart","wishlists","payments"})
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String phone;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime modifyDate;

    @JsonIgnore
    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL,orphanRemoval = true)
    private Cart cart;

    @JsonIgnore
    @OneToMany(mappedBy = "member")
    private List<Wishlist> wishlists = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "member")
    private List<Payment> payments = new ArrayList<>();
}
