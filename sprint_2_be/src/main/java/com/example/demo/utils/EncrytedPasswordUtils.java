package com.example.demo.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class EncrytedPasswordUtils {
    // Encryte Password with BCryptPasswordEncoder
    public String encrytePassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    public static void main(String[] args) {
        String password = "123456";
        String encrytedPassword = new com.example.demo.utils.EncrytedPasswordUtils().encrytePassword(password);

        System.out.println("Encryted Password: " + encrytedPassword);
        System.out.println(new BCryptPasswordEncoder().matches("123456", encrytedPassword));
    }
}

