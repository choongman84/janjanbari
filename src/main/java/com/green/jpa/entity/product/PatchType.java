package com.green.jpa.entity.product;

public enum PatchType {
    UCL("UEFA Champions League", 21000),    // 챔피언스리그 패치
    LALIGA("LALIGA", 21000),               // 라리가 패치
    SUPERCUP("UEFA Super Cup", 21000),      // 슈퍼컵 패치
    CWCUP("FIFA Club World Cup", 21000),    // 클럽월드컵 패치
    NONE("No Patch", 0);                    // 패치 없음

    private final String displayName;
    private final int price;

    PatchType(String displayName, int price) {
        this.displayName = displayName;
        this.price = price;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getPrice() {
        return price;
    }
}