package com.example.demo.controller;

import com.example.demo.dto.ProductMost;
import com.example.demo.model.Bill;
import com.example.demo.model.Cart;
import com.example.demo.model.Customer;
import com.example.demo.repository.IBillRepository;
import com.example.demo.service.product.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class BillRestController {

    @Autowired
    private ICartService iCartService;
    @Autowired
    private IBillRepository iBillRepository;

    @PostMapping("/list-bill")
    public ResponseEntity<Page<Cart>> displayListBill(@PageableDefault(15) Pageable pageable, @RequestBody Customer customer) {
        Page<Cart> cartPage = this.iCartService.displayListBill(pageable, customer);
        if (cartPage == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(cartPage, HttpStatus.OK);
        }
    }

    @GetMapping("/list-product-order")
    public ResponseEntity<List<ProductMost>> displayProductOrderMost() {
        List<ProductMost> productMostList = this.iBillRepository.displayProductOrderMost();
        if (productMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productMostList, HttpStatus.OK);
    }

}
