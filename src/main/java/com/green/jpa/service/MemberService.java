package com.green.jpa.service;

import com.green.jpa.dto.AddressDTO;
import com.green.jpa.dto.MemberDTO;
import com.green.jpa.entity.*;

import java.util.List;
import java.util.Optional;

public interface MemberService {

     // 회원 가입
     public MemberDTO signup(MemberDTO dto); //, MultipartFile profile 프로필 사진 추가할 경우 넣기
     public MemberDTO login(String email, String password);
     public Member findById(Long id);
     public String getEmailById(Long id);
     public List<Member> getAllMembers();
     Optional<Member> findByEmail(String email);
     public Member save(Member member);
     void deleteMember(Long id);
     public Long getMemberIdFromToken(String token);

     // Member -> MemberDTO 변환
     default MemberDTO toDto(Member member) {
          return MemberDTO.builder()
                  .id(member.getId())
                  .email(member.getEmail())
                  .name(member.getName())
                  .phone(member.getPhone())
                  .address(member.getAddress() != null ?
                          Address.builder()
                                  .address(member.getAddress().getAddress())
                                  .detailAddress(member.getAddress().getDetailAddress())
                                  .zipcode(member.getAddress().getZipcode())
                                  .build() : null)
                  .role(member.getRole())
                  .createDate(member.getCreateDate())
                  .modifyDate(member.getModifyDate())
                  .build();
     }


     // MemberDTO -> Member 변환
     default Member toEntity(MemberDTO dto) {
          return Member.builder()
                  .email(dto.getEmail())
                  .password(dto.getPassword()) // 비밀번호 암호화
                  .name(dto.getName())
                  .phone(dto.getPhone())
                  .address(dto.getAddress() != null ?
                          Address.builder()
                                  .address(dto.getAddress().getAddress())
                                  .detailAddress(dto.getAddress().getDetailAddress())
                                  .zipcode(dto.getAddress().getZipcode())
                                  .build() : null)
                  .role(dto.getRole())
                  .build();
     }

}
