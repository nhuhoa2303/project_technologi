package com.example.demo.service.product;

import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
    Page<Product> searchPriceAndNameLaptop(Pageable pageable,String nameSearch,String nameLaptop, String beforePrice, String firstPrice);

    Page<Product> searchPriceAndNamePhone(Pageable pageable,String nameSearch, String namePhone, String beforePrice, String firstPrice);
    Page<Product> searchPriceAndNameProduct(Pageable pageable,String nameSearch, String beforePrice, String firstPrice);

    Product save(Product product);

}
