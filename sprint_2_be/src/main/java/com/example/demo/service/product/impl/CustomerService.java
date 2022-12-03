package com.example.demo.service.product.impl;

import com.example.demo.model.Customer;
import com.example.demo.repository.ICustomerRepository;
import com.example.demo.service.product.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements ICustomerService {
    @Autowired
    private ICustomerRepository iCustomerRepository;

    @Override
    public Customer getCustomerByUserName(String userName) {
        return this.iCustomerRepository.getCustomerByUserName(userName);
    }

}
