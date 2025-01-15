package com.green.jpa.service;

import com.green.jpa.config.JwtTokenProvider;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.MemberRole;
import com.green.jpa.entity.product.Cart;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.repository.product.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final CartRepository cartRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MemberDTO signup(MemberDTO dto) {
        if (memberRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPassword);
        if(dto.getRole().equals("USER")){
            dto.setRole(MemberRole.USER);
        }else {
            System.out.println("role"+dto.getRole());
        }
        Member member = toEntity(dto); // DTO -> Entity 변환
        Member savedMember = memberRepository.save(member); // 저장

        // 회원가입 시 장바구니 생성
        Cart cart = Cart.builder()
                .member(savedMember)
                .build();
        cartRepository.save(cart);

        return toDto(savedMember); // Entity -> DTO 변환
    }

    @Override
    public MemberDTO login(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("이메일이 존재하지 않습니다."));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            System.out.println("Raw password: " + password);
            System.out.println("Stored password: " + member.getPassword());
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

//        if (!passwordEncoder.matches(password, member.getPassword())) {
//            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
//        }
        System.out.println("777) 여기는 나오잖아 그럼 문제가 없잔아?");
        MemberDTO user = toDto(member);
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail()); // Add user's email to claims
        claims.put("role", user.getRole()); // Add user's role to claims

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(claims,10000l);

        MemberDTO memberDTO = toDto(member);
        memberDTO.setToken(token); // 토큰 추가

        return memberDTO;
    }

    @Override
    public Member findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
    }

    @Override
    public String getEmailById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 회원 존재 X"));
        return member.getEmail();
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    @Override
    public Member save(Member member) {
        return memberRepository.save(member);
    }

    @Override
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    @Override
    public Long getMemberIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        String memberId = jwtTokenProvider.getUsernameFromToken(token);
        return Long.parseLong(memberId);
    }


}
