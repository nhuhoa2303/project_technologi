package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.ICategoryRepository;
import com.example.demo.repository.IProductRepository;
import com.example.demo.service.product.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RestController
@CrossOrigin
public class ProductController {
    @Autowired
    private IProductRepository iProductRepository;
    @Autowired
    private ICategoryRepository iCategoryRepository;

    @Autowired
    private IProductService iProductService;


    /*
    dùng để lấy danh sách laptop vừa phân trang vừa tìm kiếm các trường : giá, tên sản phẩm
     */
    @GetMapping("/laptop/page")
    public ResponseEntity<Page<Product>> searchPriceAndNameLaptop(@RequestParam(value = "nameLaptop", required = false, defaultValue = "") String nameLaptop,
                                                                  @RequestParam(value = "nameSearch", required = false, defaultValue = "") String nameSearch,
                                                                  @RequestParam(value = "beforePrice", required = false, defaultValue = "0") String beforePrice,
                                                                  @RequestParam(value = "afterPrice", required = false, defaultValue = "9999999999") String afterPrice,
                                                                  @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
                                                                  @RequestParam(value = "size", required = false, defaultValue = "9") Integer size,
                                                                  @RequestParam(value = "sort", required = false, defaultValue = "id") String sort) {
        Sort sortable = getSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortable);
        Page<Product> productPage = this.iProductService.searchPriceAndNameLaptop(pageable, nameSearch, nameLaptop, beforePrice, afterPrice);
        if (productPage == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productPage, OK);
    }


    /*
  dùng để lấy danh sách phone vừa phân trang vừa tìm kiếm các trường : giá, tên sản phẩm
   */
    @GetMapping("/phone/page")
    public ResponseEntity<Page<Product>> searchPriceAndNamePhone(@RequestParam(value = "namePhone", required = false, defaultValue = "") String namePhone,
                                                                 @RequestParam(value = "nameSearch", required = false, defaultValue = "") String nameSearch,
                                                                 @RequestParam(value = "beforePrice", required = false, defaultValue = "0") String beforePrice,
                                                                 @RequestParam(value = "afterPrice", required = false, defaultValue = "9999999999") String afterPrice,
                                                                 @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
                                                                 @RequestParam(value = "size", required = false, defaultValue = "9") Integer size,
                                                                 @RequestParam(value = "sort", required = false, defaultValue = "id") String sort) {
        Sort sortable = getSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortable);
        Page<Product> productPage = this.iProductService.searchPriceAndNamePhone(pageable, nameSearch, namePhone, beforePrice, afterPrice);
        if (productPage == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productPage, OK);
    }

    @GetMapping("/product/page")
    public ResponseEntity<Page<Product>> searchPriceAndNameProduct(@RequestParam(value = "nameSearch", required = false, defaultValue = "") String nameSearch,
                                                                   @RequestParam(value = "beforePrice", required = false, defaultValue = "0") String beforePrice,
                                                                   @RequestParam(value = "afterPrice", required = false, defaultValue = "9999999999") String afterPrice,
                                                                   @PageableDefault(12) Pageable pageable) {

        Page<Product> productPage = this.iProductService.searchPriceAndNameProduct(pageable, nameSearch, beforePrice, afterPrice);
        if (productPage == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(productPage, OK);
    }

    private Sort getSort(String sort) {
        Sort sortable;
        switch (sort) {
            case "price_sale,asc":
                sortable = Sort.by(Sort.Order.asc("price_sale"));
                break;
            case "price_sale,desc":
                sortable = Sort.by(Sort.Order.desc("price_sale"));
                break;
            default:
                sortable = Sort.by(Sort.Order.asc(sort));
        }
        return sortable;
    }


    // hiển thị toàn bộ danh sách category
    @GetMapping("/category")
    public ResponseEntity<List<Category>> displayCategory() {
        List<Category> categoryPage = this.iCategoryRepository.findAll();
        if (categoryPage == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(categoryPage, HttpStatus.OK);
    }

    // hiển thị toàn bộ danh sách product
    @GetMapping("/product")
    public ResponseEntity<Page<Product>> displayProduct(@PageableDefault(12) Pageable pageable) {
        Page<Product> productPage = this.iProductRepository.findAll(pageable);
        if (productPage == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productPage, HttpStatus.OK);
    }


    // sắp xếp sản phẩm mới nhất
    @GetMapping("/near-day")
    public ResponseEntity<List<Product>> displayProductNewDay() {
        List<Product> products = this.iProductRepository.getProductNewDay();
        if (products == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    // xem sản phẩm chi tiết
    @GetMapping("/detail/{id}")
    public ResponseEntity<Optional<Product>> displayProductById(@PathVariable Integer id) {
        Optional<Product> pr = this.iProductRepository.findById(id);
        if (pr == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(pr, HttpStatus.OK);
    }

    // thêm mới sản phẩm
    @PostMapping("/add")
    public ResponseEntity<Product> addAll(@RequestBody Product product) {
        Product pr = this.iProductService.save(product);
        if (pr == null) {
            return new ResponseEntity<>(NOT_FOUND);
        }
        return new ResponseEntity<>(pr, OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Optional<Product> pr = this.iProductRepository.findById(id);
        if (!pr.isPresent()) {
            return new ResponseEntity<>(NOT_FOUND);
        }
        this.iProductRepository.updateIsDeleted(id);
        return new ResponseEntity<>(OK);
    }

    @PatchMapping("/update")
    public ResponseEntity<Product> update(@RequestBody Product product) {
        Product pr = this.iProductRepository.save(product);
        return new ResponseEntity<>(pr, OK);
    }
}
