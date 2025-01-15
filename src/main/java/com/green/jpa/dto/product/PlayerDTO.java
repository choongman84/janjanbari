package com.green.jpa.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO {
    private Long id;
    private String name;
    private String number;
    private String position;
}