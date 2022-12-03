package com.example.demo.repository;

import com.example.demo.dto.ProductMost;
import com.example.demo.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface IStaticalProductRepository extends JpaRepository<Bill,Integer> {



    @Query(value = " select product.name as name, sum(cart.quantity) as quantity from bill " +
            " join cart on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " where creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub(now(),INTERVAL 1 week) and now() ) " +
            " group by product.name " +
            " having quantity > 1 " +
            " order by quantity desc limit 0,10 ", nativeQuery = true)
    List<ProductMost> displayProductOrderMostByWeek();

    @Query(value = " select product.name as name, sum(cart.quantity) as quantity from bill " +
            " join cart on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " where creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub(now(),INTERVAL 1 month) and now() ) " +
            " group by product.name " +
            " having quantity > 1 " +
            " order by quantity desc limit 0,10 ", nativeQuery = true)
    List<ProductMost> displayProductOrderMostByMonth();

    @Query(value = " select product.name as name, sum(cart.quantity) as quantity from bill " +
            " join cart on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " where creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub(now(),INTERVAL 1 year) and now() ) " +
            " group by product.name " +
            " having quantity > 1 " +
            " order by quantity desc limit 0,10 ", nativeQuery = true)
    List<ProductMost> displayProductOrderMostByYear();

    @Query(value=" select product.name, sum(cart.quantity) as quantity from bill " +
            " join cart on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " where creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join bill on cart.bill_id = bill.id \n" +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between :start and :end ) " +
            " group by product.name " +
            " order by quantity desc limit 0,10 ", nativeQuery = true )
    List<ProductMost> displayProductOrderMostBySearch(@Param("start") Date start,@Param("end") Date end );


}
