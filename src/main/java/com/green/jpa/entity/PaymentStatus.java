package com.green.jpa.entity;


import lombok.Getter;

@Getter
public enum PaymentStatus {
    PENDING("결제 대기"),
    COMPLETE("결제 완료"),
    CANCELLED("결제 취소"),
    FAILED("결제 실패"),
    REFUND("환불 완료");
    private final String displayName;

    PaymentStatus(String displayName){
        this.displayName = displayName;
    }

}
