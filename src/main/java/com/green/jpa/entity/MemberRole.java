package com.green.jpa.entity;

public enum MemberRole {
    USER("회원"),
    ADMIN("관리자");

    private final String displayName;

    MemberRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}