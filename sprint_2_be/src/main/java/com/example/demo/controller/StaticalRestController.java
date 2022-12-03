package com.example.demo.controller;

import com.example.demo.dto.CustomerOrderMost;
import com.example.demo.dto.ProductMost;
import com.example.demo.repository.ICustomerRepository;
import com.example.demo.repository.IStaticalProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;


import java.sql.Date;
import java.util.List;

@RestController
@CrossOrigin
public class StaticalRestController {
    @Autowired
    private IStaticalProductRepository iStaticalProductRepository;

    @Autowired
    private ICustomerRepository iCustomerRepository;

    @GetMapping("/list-product-order-by-week")
    public ResponseEntity<List<ProductMost>> displayProductOrderMostByWeek() {
        List<ProductMost> productMostList = this.iStaticalProductRepository.displayProductOrderMostByWeek();
        if (productMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productMostList, HttpStatus.OK);
    }

    @GetMapping("/list-product-order-by-month")
    public ResponseEntity<List<ProductMost>> displayProductOrderMostByMonth() {
        List<ProductMost> productMostList = this.iStaticalProductRepository.displayProductOrderMostByMonth();
        if (productMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productMostList, HttpStatus.OK);
    }

    @GetMapping("/list-product-order-by-year")
    public ResponseEntity<List<ProductMost>> displayProductOrderMostByYear() {
        List<ProductMost> productMostList = this.iStaticalProductRepository.displayProductOrderMostByYear();
        if (productMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productMostList, HttpStatus.OK);
    }

    @GetMapping("/search-product-by-date/{start}/{end}")
    public ResponseEntity<List<ProductMost>> displayProductOrderMostBySearch(@PathVariable Date start, @PathVariable Date end) {
        List<ProductMost> productMostList = this.iStaticalProductRepository.displayProductOrderMostBySearch(start,end);
        if (productMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productMostList, HttpStatus.OK);
    }

    @GetMapping("/list-customer-order-by-week")
    public ResponseEntity<List<CustomerOrderMost>> displayCustomerOrderMostByWeek() {
        List<CustomerOrderMost> customerOrderMostList = this.iCustomerRepository.displayCustomerOrderMostWeek();
        if (customerOrderMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customerOrderMostList, HttpStatus.OK);
    }

    @GetMapping("/list-customer-order-by-month")
    public ResponseEntity<List<CustomerOrderMost>> displayCustomerOrderMostByMonth() {
        List<CustomerOrderMost> customerOrderMostList = this.iCustomerRepository.displayCustomerOrderMostMonth();
        if (customerOrderMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customerOrderMostList, HttpStatus.OK);
    }
    @GetMapping("/list-customer-order-by-year")
    public ResponseEntity<List<CustomerOrderMost>> displayCustomerOrderMostByYear() {
        List<CustomerOrderMost> customerOrderMostList = this.iCustomerRepository.displayCustomerOrderMostYear();
        if (customerOrderMostList == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(customerOrderMostList, HttpStatus.OK);
    }


}
