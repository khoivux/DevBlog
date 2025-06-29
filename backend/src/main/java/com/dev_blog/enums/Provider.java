package com.dev_blog.enums;

public enum Provider {
    GOOGLE("google"),
    GITHUB("github");

    private final String value;

    Provider(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    public static Provider fromString(String value) {
        for (Provider provider : Provider.values()) {
            if (provider.value.equalsIgnoreCase(value)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Invalid OauthProvider: " + value);
    }
}
