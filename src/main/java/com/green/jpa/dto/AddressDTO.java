package com.green.jpa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
/*
용도:
- 주소 정보 요청/응답 통합 DTO
- Member, Order에서 사용
- 카카오 주소 API 응답과 매핑

특징:
- 기본주소, 상세주소, 우편번호 포함
- validation 적용
*/
public class AddressDTO {

    @NotBlank(message = "기본주소는 필수 입니다")
    private String address; // 기본주소 (도로명주소) api가 처리할꺼임

    private String detailAddress; //상세주소 (동/호수) 이건 사용자가 직접입력

    @NotBlank(message = "우편번호는 필수입니다")
    @Pattern(regexp = "\\d{5}", message = "우편번호는 5자리 숫자여야 합니다")
    private String zipcode; //우편번호
}
