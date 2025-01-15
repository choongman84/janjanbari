package com.green.jpa.test.repository;


import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.Address;
import com.green.jpa.entity.Member;
import com.green.jpa.entity.MemberRole;
import com.green.jpa.repository.MemberRepository;
import com.green.jpa.service.MemberService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;


import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {

    @Autowired
    private MemberService memberService;

    @Test
    @DisplayName("일반 회원 가입 및 로그인 테스트")
    void userTest() {
        // 회원가입 테스트
        MemberDTO userDTO = MemberDTO.builder()
                .email("user@test.com")
                .password("password123")
                .name("일반유저")
                .phone("010-1234-5678")
                .address(new Address("13480", "경기도 성남시", "상세주소"))
                .role(MemberRole.USER)
                .build();

        MemberDTO savedUser = memberService.signup(userDTO);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("user@test.com");
        assertThat(savedUser.getRole()).isEqualTo(MemberRole.USER);

        // 로그인 테스트
        MemberDTO loginResult = memberService.login(userDTO.getEmail(), "password123");

        assertThat(loginResult).isNotNull();
        assertThat(loginResult.getEmail()).isEqualTo("user@test.com");
        assertThat(loginResult.getToken()).isNotNull();
    }

    @Test
    @DisplayName("관리자 회원 가입 및 로그인 테스트")
    @Commit
    void adminTest() {
        // 회원가입 테스트
        MemberDTO adminDTO = MemberDTO.builder()
                .email("b@b.com")
                .password("1234")
                .name("관리자")
                .phone("010-9876-5432")
                .address(new Address("서울 송파", "충만1동", "06234"))
                .role(MemberRole.ADMIN)
                .build();

        MemberDTO savedAdmin = memberService.signup(adminDTO);

        assertThat(savedAdmin).isNotNull();
        assertThat(savedAdmin.getEmail()).isEqualTo("a@b.com");
        assertThat(savedAdmin.getRole()).isEqualTo(MemberRole.ADMIN);

        // 로그인 테스트
        MemberDTO loginResult = memberService.login(adminDTO.getEmail(), "1234");

        assertThat(loginResult).isNotNull();
        assertThat(loginResult.getEmail()).isEqualTo("a@b.com");
        assertThat(loginResult.getToken()).isNotNull();
        assertThat(loginResult.getRole()).isEqualTo(MemberRole.ADMIN);
    }
}
