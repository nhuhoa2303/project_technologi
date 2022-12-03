package com.example.demo.service.product.impl;

import com.example.demo.model.Product;
import com.example.demo.repository.IProductRepository;
import com.example.demo.service.product.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements IProductService {
    @Autowired
    private IProductRepository iProductRepository;

    @Override
    public Page<Product> searchPriceAndNameLaptop(Pageable pageable, String nameSearch, String nameLaptop, String beforePrice, String firstPrice) {
        Double before = Double.valueOf(beforePrice);
        Double first = Double.valueOf(firstPrice);
        return this.iProductRepository.searchPriceAndNameLaptop(pageable, "%" + nameSearch + "%", "%" + nameLaptop + "%", before, first);
    }

    @Override
    public Page<Product> searchPriceAndNamePhone(Pageable pageable, String nameSearch, String namePhone, String beforePrice, String firstPrice) {
        Double before = Double.valueOf(beforePrice);
        Double first = Double.valueOf(firstPrice);
        return this.iProductRepository.searchPriceAndNamePhone(pageable, "%" + nameSearch + "%", "%" + namePhone + "%", before, first);
    }

    @Override
    public Page<Product> searchPriceAndNameProduct(Pageable pageable, String nameSearch, String beforePrice, String firstPrice) {
        Double before = Double.valueOf(beforePrice);
        Double first = Double.valueOf(firstPrice);
        return this.iProductRepository.searchPriceAndNamProduct(pageable, "%" + nameSearch + "%", before, first);
    }

    @Override
    public Product save(Product product) {
       return this.iProductRepository.save(product);
    }
}
