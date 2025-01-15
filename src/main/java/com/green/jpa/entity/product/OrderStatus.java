package com.green.jpa.entity.product;

public enum OrderStatus {
    PENDING("주문대기"),
    PAID("결제완료"),
    PREPARING("상품준비중"),
    SHIPPING("배송중"),
    DELIVERED("배송완료"),
    CANCELLED("주문취소");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}