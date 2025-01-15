package com.green.jpa.repository;

import com.green.jpa.entity.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    @EntityGraph(attributePaths = { "memberRoleList" })
    @Query("select m from Member m where m.email = :email")
    Member getWithRoles(@Param("email") String email);
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Member> findByEmailAndName(String email, String name);


}
