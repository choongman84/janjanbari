//package com.green.jpa.test.repository;
//
//import com.green.jpa.dto.AddressDTO;
//import com.green.jpa.dto.MemberDTO;
//import com.green.jpa.entity.Member;
//import com.green.jpa.entity.MemberRole;
//import com.green.jpa.repository.MemberRepository;
//import com.green.jpa.service.MemberService;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import jakarta.validation.ConstraintViolation;
//import jakarta.validation.Validator;
//import java.util.Set;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertFalse;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//
//@SpringBootTest
////@Transactional
//public class MemberServiceTest {
//
//    @Autowired
//    private MemberService memberService;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @Autowired
//    private Validator validator;
//
//    @Test
//    @DisplayName("정상적인 회원가입 테스트")
//    void signupSuccessTest() {
//        // given
//        AddressDTO addressDTO = AddressDTO.builder()
//                .address("서울시 강남구")
//                .detailAddress("테헤란로 123")
//                .zipcode("12345")
//                .build();
//
//        MemberDTO memberDTO = MemberDTO.builder()
//                .name("홍길동")
//                .email("test@example.com")
//                .password("password123")
//                .phone("010-1234-5678")
//                .address(addressDTO)
//                .build();
//
//        // when
//        MemberDTO savedMember = memberService.signup(memberDTO);
//
//        // then
//        assertNotNull(savedMember.getId());
//        assertEquals(memberDTO.getName(), savedMember.getName());
//        assertEquals(memberDTO.getEmail(), savedMember.getEmail());
//        assertEquals(memberDTO.getPhone(), savedMember.getPhone());
//        assertEquals(MemberRole.USER, savedMember.getRole());
//        assertNotNull(savedMember.getCreateDate());
//    }
//
//    @Test
//    @DisplayName("중복 이메일 회원가입 실패 테스트")
//    void signupDuplicateEmailTest() {
//        // given
//        MemberDTO memberDTO1 = MemberDTO.builder()
//                .name("홍길동")
//                .email("test@example.com")
//                .password("password123")
//                .phone("010-1234-5678")
//                .build();
//
//        memberService.signup(memberDTO1);
//
//        MemberDTO memberDTO2 = MemberDTO.builder()
//                .name("김철수")
//                .email("test@example.com")  // 같은 이메일
//                .password("password456")
//                .phone("010-8765-4321")
//                .build();
//
//        // when & then
//        assertThrows(IllegalArgumentException.class, () -> {
//            memberService.signup(memberDTO2);
//        });
//    }
//
//    @Test
//    @DisplayName("필수 필드 누락 회원가입 실패 테스트")
//    void signupMissingRequiredFieldsTest() {
//        // given
//        MemberDTO invalidMemberDTO = MemberDTO.builder()
//                .name("")  // 빈 이름
//                .email("invalid-email")  // 잘못된 이메일 형식
//                .password("")  // 빈 비밀번호
//                .build();
//
//        // when & then
//        Set<ConstraintViolation<MemberDTO>> violations = validator.validate(invalidMemberDTO);
//        assertFalse(violations.isEmpty());
//    }
//    @Test
//    void testMember1(){
//        Member member = memberRepository.findById(1L).orElseThrow(() -> new IllegalArgumentException("no pass"));
//        System.out.println("dto = " + member.getPassword());
//
//    }
//}
