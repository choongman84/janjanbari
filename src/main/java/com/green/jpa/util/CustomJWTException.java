package com.green.jpa.util;

public class CustomJWTException extends RuntimeException{
    public CustomJWTException(String message) {
        super(message);
    }
}
