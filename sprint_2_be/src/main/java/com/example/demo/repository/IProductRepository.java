package com.example.demo.repository;

import com.example.demo.model.Cart;
import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<Product, Integer> {

    // hiện thị danh sách sản phẩm search giá và sản phẩm của laptop
    @Query(value = " select * from product " +
            "where id_category = 1 and `name` like :nameLaptop and `name` like :nameSearch and price_sale  BETWEEN :beforePrice and :afterPrice and is_delete = 0   ",
            countQuery = " select count(*) from ( select * from product " +
                    "where id_category = 1 and `name` like :nameLaptop and `name` like :nameSearch and price_sale BETWEEN :beforePrice and :afterPrice and is_delete = 0  ) temp ",
            nativeQuery = true)
    Page<Product> searchPriceAndNameLaptop(Pageable pageable,
                                           @Param("nameLaptop") String nameLaptop,
                                           @Param("nameSearch") String nameSearch,
                                           @Param("beforePrice") Double beforePrice,
                                           @Param("afterPrice") Double afterPrice);

    // hiện thị danh sách sản phẩm search giá và sản phẩm của phone
    @Query(value = " select * from product " +
            "where id_category = 2 and `name` like :namePhone and `name` like :nameSearch and price_sale  BETWEEN :beforePrice and :afterPrice and is_delete = 0   ",
            countQuery = " select count(*) from ( select * from product " +
                    "where id_category = 2 and `name` like :namePhone and `name` like :nameSearch and price_sale BETWEEN :beforePrice and :afterPrice and is_delete = 0  ) temp ",
            nativeQuery = true)
    Page<Product> searchPriceAndNamePhone(Pageable pageable,
                                          @Param("namePhone") String namePhone,
                                          @Param("nameSearch") String nameSearch,
                                          @Param("beforePrice") Double beforePrice,
                                          @Param("afterPrice") Double afterPrice);

    // hiện thị danh sách sản phẩm search giá và sản phẩm của phone
    @Query(value = " select * from product " +
            "where `name` like :nameSearch and price_sale  BETWEEN :beforePrice and :afterPrice and is_delete = 0   ",
            countQuery = " select count(*) from ( select * from product " +
                    "where  `name` like :nameSearch and price_sale BETWEEN :beforePrice and :afterPrice and is_delete = 0  ) temp ",
            nativeQuery = true)
    Page<Product> searchPriceAndNamProduct(Pageable pageable,
                                           @Param("nameSearch") String nameSearch,
                                           @Param("beforePrice") Double beforePrice,
                                           @Param("afterPrice") Double afterPrice);

// hiện thị danh sách sản phẩm gần đây

    @Query(value = " SELECT * FROM product where product.is_delete = 0 " +
            " ORDER BY ABS( DATEDIFF( create_date, NOW() ) ) limit 8 ",
            nativeQuery = true)
    List<Product> getProductNewDay();

    @Modifying
    @Transactional
    @Query(value = " UPDATE `product` " +
            " SET `quantity` = (`quantity` - :quantity) " +
            " WHERE (`id` = :id) ", nativeQuery = true)
    void updateQuantity(Integer quantity, Integer id);

    @Modifying
    @Transactional
    @Query(value = " UPDATE `product` SET `is_delete` = 1 " +
            " WHERE `id` = :id ", nativeQuery = true)
    void updateIsDeleted(@Param("id") Integer id);

}
