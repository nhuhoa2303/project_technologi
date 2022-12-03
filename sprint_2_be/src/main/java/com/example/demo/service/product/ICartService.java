package com.example.demo.service.product;

import com.example.demo.dto.ErrorDTO;
import com.example.demo.dto.PaymentDto;
import com.example.demo.model.Cart;
import com.example.demo.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICartService {
    ErrorDTO saveCart(Cart cart);

    PaymentDto goPayment(Customer customer);


    Boolean minusQuantity(Cart productOrder);

    Boolean plusQuantity(Cart productOrder);

    List<Cart> displayProductInCart(Customer customer);

    Page<Cart> displayListBill(Pageable pageable, Customer customer);

    Boolean findProductOrder(Cart productOrder);
}
