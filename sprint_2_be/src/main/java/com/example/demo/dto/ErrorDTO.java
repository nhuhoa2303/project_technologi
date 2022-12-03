package com.example.demo.dto;

import com.example.demo.model.Cart;
import lombok.Data;

import java.util.List;

@Data
public class ErrorDTO {
    private String message;
    private List<String> messageList;
    private Cart cart;
}
