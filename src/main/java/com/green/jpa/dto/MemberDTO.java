package com.green.jpa.dto;

import com.green.jpa.entity.MemberRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.green.jpa.entity.Address;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO implements UserDetails {

    private Long id;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    private String token;

    //@NotBlank(message = "이름은 필수입니다")
    private String name;

    private String phone;

    private Address address; // Address 타입 사용

    private MemberRole role;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부 (기본 true)
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 여부 (기본 true)
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명 만료 여부 (기본 true)
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부 (기본 true)
    }

    public Map<String, Object> toClaims() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", this.id);
        claims.put("email", this.email);
        claims.put("name", this.name);
        claims.put("role", this.role != null ? this.role.name() : null);
        claims.put("createDate", this.createDate != null ? this.createDate.toString() : null);
        if (this.address != null) {
            claims.put("address", this.address.toString());
        }
        return claims;
    }
}
