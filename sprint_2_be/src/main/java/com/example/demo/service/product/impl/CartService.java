package com.example.demo.service.product.impl;

import com.example.demo.dto.ErrorDTO;
import com.example.demo.dto.PaymentDto;
import com.example.demo.model.Bill;
import com.example.demo.model.Cart;
import com.example.demo.model.Customer;
import com.example.demo.model.Product;
import com.example.demo.repository.IBillRepository;
import com.example.demo.repository.ICartRepository;
import com.example.demo.repository.IProductRepository;
import com.example.demo.service.product.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;

@Service
public class CartService implements ICartService {
    @Autowired
    private ICartRepository iCartRepository;
    @Autowired
    private IProductRepository iProductRepository;
    @Autowired
    private IBillRepository iBillRepository;

    @Override
    public ErrorDTO saveCart(Cart cart) {
        ErrorDTO errorDto = new ErrorDTO();
        cart.setIsDelete(false);
        Cart orderProduct = this.iCartRepository.findProductOrderListByCustomerAndProduct(cart);
        if (orderProduct == null) {
            if (cart.getQuantity() > cart.getProduct().getQuantity()) {
                errorDto.setMessage("quantity");
                errorDto.setCart(orderProduct);
                return errorDto;
            } else {
                this.iCartRepository.save(cart);
            }
        } else {
            if ((orderProduct.getQuantity() + cart.getQuantity()) > cart.getProduct().getQuantity()) {
                errorDto.setMessage("quantity");
                errorDto.setCart(orderProduct);
                return errorDto;
            } else {
                orderProduct.setQuantity(cart.getQuantity() + orderProduct.getQuantity());
                this.iCartRepository.save(orderProduct);
            }
        }
        return errorDto;
    }

    @Transactional
    @Override
    public PaymentDto goPayment(Customer customer) {
        List<Cart> carts = this.iCartRepository.displayProductInCart(customer);
        List<Bill> billList = this.iBillRepository.findAll();
        int randomCode = this.getRandomNumber(billList);
        Bill bill = new Bill();
        bill.setCode(String.valueOf(randomCode));
        bill.setCartList(carts);
        bill.setIsDeleted(false);
        bill.setCreationDate(new Date(System.currentTimeMillis()));
        this.iBillRepository.save(bill);
        Bill billReturn = this.iBillRepository.getBillByCode(randomCode);
        this.iCartRepository.setBill(customer.getId(), billReturn.getId());

        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setBill(billReturn);
        paymentDto.setCartList(carts);
        paymentDto.setCustomer(customer);
        for (Cart ca : carts) {
            this.iProductRepository.updateQuantity(ca.getQuantity(), ca.getProduct().getId());
            Product product = this.iProductRepository.getById(ca.getProduct().getId());
            if (product.getQuantity() <= 1) {
                this.iProductRepository.updateIsDeleted(product.getId());
            }
        }
        return paymentDto;
    }

    private int getRandomNumber(List<Bill> billList) {
        int randomNumber = 10000;
        while (checkExists(billList, randomNumber)) {
            randomNumber = (int) ((Math.random() * 89999) + 10001);
        }
        return randomNumber;
    }

    private boolean checkExists(List<Bill> billList, int randomNumber) {
        for (Bill bill : billList) {
            if (Integer.parseInt(bill.getCode()) == randomNumber) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Boolean minusQuantity(Cart productOrder) {
        if (productOrder.getQuantity() > 1) {
            productOrder.setQuantity(productOrder.getQuantity() - 1);
            this.iCartRepository.save(productOrder);
            return true;
        }
        return false;
    }

    @Override
    public Boolean plusQuantity(Cart productOrder) {
        if (productOrder.getQuantity() < productOrder.getProduct().getQuantity()) {
            productOrder.setQuantity(productOrder.getQuantity() + 1);
            this.iCartRepository.save(productOrder);
            return true;
        }
        return false;
    }

    @Override
    public List<Cart> displayProductInCart(Customer customer) {
        return this.iCartRepository.displayProductInCart(customer);
    }

    @Override
    public Page<Cart> displayListBill(Pageable pageable, Customer customer) {
        return this.iCartRepository.displayListBill(pageable, customer);
    }

    @Override
    public Boolean findProductOrder(Cart productOrder) {
        Cart po = this.iCartRepository.findById(productOrder.getId()).orElse(null);
        if (po != null) {
            this.iCartRepository.delete(productOrder);
            return true;
        }
        return false;
    }

}
