package com.example.demo.repository;

import com.example.demo.dto.ProductMost;
import com.example.demo.model.Bill;
import com.example.demo.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bill, Integer> {
    @Query(value = " select * from bill where code = :randomCode ", nativeQuery = true)
    Bill getBillByCode(@Param("randomCode") int randomCode);
//
//    @Query(value = " select bill.id, bill.is_deleted, bill.code , customer.name , bill.creation_date, cart.quantity ,product.name ," +
//            " product.price_sale  , product.price_sale * cart.quantity  from bill " +
//            " join cart on cart.bill_id = bill.id " +
//            " join product on product.id = cart.id_product " +
//            " join customer on customer.id = cart.customer_id  " +
//            " where cart.customer_id = :#{#customer.id} and cart.is_deleted = 0 order by bill.creation_date desc  ",
//            countQuery = " select count (*) from ( select bill.id, bill.is_deleted, bill.code , customer.name , bill.creation_date, cart.quantity ,product.name ," +
//                    " product.price_sale , product.price_sale * cart.quantity  from bill " +
//                    " join cart on cart.bill_id = bill.id " +
//                    " join product on product.id = cart.id_product " +
//                    " join customer on customer.id = cart.customer_id " +
//                    " where cart.customer_id = :#{#customer.id} " +
//                    " and cart.is_deleted = 0 " +
//                    " order by bill.creation_date desc ) temp"
//            , nativeQuery = true)
//    Page<Bill> displayListBill(Pageable pageable, Customer customer);

    @Query(value = " select product.name as name ,sum(cart.quantity) as quantity from bill " +
            " join cart on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " join customer on customer.id = cart.customer_id " +
            " group by product.name order by cart.quantity desc ", nativeQuery = true)
    List<ProductMost> displayProductOrderMost();



}
