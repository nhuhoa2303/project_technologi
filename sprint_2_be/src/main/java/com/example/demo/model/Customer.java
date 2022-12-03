package com.example.demo.model;

import com.example.demo.model.account.AppUser;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String phoneNumber;

    @Column(columnDefinition = "text")
    private String address;
    private String gender;

    @Column(columnDefinition = "date")
    private String birthday;
    @Column(columnDefinition = "text")
    private String image;
    @Column(columnDefinition = "bit(1) default 0")
    private Boolean isDelete;


    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Cart> cartList;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser appUser;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Customer customer = (Customer) o;
        return id != null && Objects.equals(id, customer.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
