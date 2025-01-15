package com.green.jpa.entity.product;

public enum KitType {
    HOME("홈 유니폼", "23/24 시즌 홈 유니폼"),
    AWAY("어웨이 유니폼", "23/24 시즌 어웨이 유니폼"),
    THIRD("써드 유니폼", "23/24 시즌 써드 유니폼"),
    GOALKEEPER_HOME("홈 골키퍼 유니폼", "23/24 시즌 홈 골키퍼 유니폼"),
    GOALKEEPER_AWAY("어웨이 골키퍼 유니폼", "23/24 시즌 어웨이 골키퍼 유니폼");

    private final String displayName;
    private final String description;

    KitType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}