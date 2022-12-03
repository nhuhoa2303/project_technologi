package com.example.demo.utils;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Data
public class TokenUtil {
    private Map<String, String> tokenMap = new HashMap<>();
}
