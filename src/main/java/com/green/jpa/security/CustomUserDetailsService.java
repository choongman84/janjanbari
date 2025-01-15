package com.green.jpa.security;


import com.green.jpa.dto.AddressDTO;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("------------ loadUserByUsername: {}", email);

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        log.info("this is email:  888) " +member);
        MemberDTO memberDTO = MemberDTO.builder()
                .id(member.getId())
                .email(member.getEmail())
                .password(member.getPassword())
                .name(member.getName())
                .phone(member.getPhone())
                .address(member.getAddress()) // Address 반영
                .role(member.getRole())
                .createDate(member.getCreateDate())
                .modifyDate(member.getModifyDate())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + member.getRole().name())))
                .build();

        log.info("MemberDTO created: {}", memberDTO);

        return memberDTO;
    }
}
