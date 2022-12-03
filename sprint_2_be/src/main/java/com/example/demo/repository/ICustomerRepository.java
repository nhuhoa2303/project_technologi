package com.example.demo.repository;

import com.example.demo.dto.CustomerOrderMost;
import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICustomerRepository extends JpaRepository<Customer, Integer> {

    @Query(value = " select c.* from customer c " +
            " join app_user u on c.user_id = u.id" +
            " where user_name = :userName ", nativeQuery = true)
    Customer getCustomerByUserName(String userName);

    @Query(value = " select customer.name as name, count(customer.name) as orderQuantity from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " where bill.creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub((now()) ,INTERVAL 1 week) and now() )" +
            " group by customer.name " , nativeQuery = true)
    List<CustomerOrderMost> displayCustomerOrderMostWeek();
    @Query(value = " select customer.name as name, count(customer.name) as orderQuantity from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " where bill.creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub((now()) ,INTERVAL 1 month) and now() )" +
            " group by customer.name " , nativeQuery = true)
    List<CustomerOrderMost> displayCustomerOrderMostMonth();
    @Query(value = " select customer.name as name, count(customer.name) as orderQuantity from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " where bill.creation_date in " +
            " (select bill.creation_date as ngay_tao from cart " +
            " join customer on customer.id = cart.customer_id " +
            " join bill on cart.bill_id = bill.id " +
            " join product on product.id = cart.id_product " +
            " having ngay_tao between date_sub((now()) ,INTERVAL 1 year) and now() )" +
            " group by customer.name " , nativeQuery = true)
    List<CustomerOrderMost> displayCustomerOrderMostYear();
}
