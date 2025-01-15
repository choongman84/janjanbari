package com.green.jpa.dto.product;


import lombok.Builder;
import lombok.Getter;
//1125 추가
@Getter
@Builder
public class PriceCalculationDTO {
    private int basePrice;
    private int customizationPrice;
    private int totalPrice;
}