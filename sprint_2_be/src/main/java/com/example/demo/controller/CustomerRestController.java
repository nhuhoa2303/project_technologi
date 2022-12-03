package com.example.demo.controller;

import com.example.demo.model.Customer;
import com.example.demo.service.product.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
public class CustomerRestController {

    @Autowired
    private ICustomerService iCustomerService;

    @GetMapping("/customer/{userName}")
    public ResponseEntity<Customer> getCustomerByUserName(@PathVariable String userName) {
        Customer customer = iCustomerService.getCustomerByUserName(userName);
        if (userName == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }
}
