package com.green.jpa.entity.product;

public enum Gender {
    MEN("남성"),
    WOMEN("여성"),
    KIDS("키즈");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}