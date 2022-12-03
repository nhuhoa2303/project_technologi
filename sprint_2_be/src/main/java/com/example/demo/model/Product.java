package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@RequiredArgsConstructor
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Column(columnDefinition = "date")
    private Date createDate;
    private Integer quantity;
    private Double price;
    private Double priceSale;
    private String madeIn;
    @Column(columnDefinition = "text")
    private String specifications;
    @ManyToOne
    @JoinColumn(name = "id_category", referencedColumnName = "id")
    private Category category;
    @Column(columnDefinition = "text")
    private String image;
    @Column(columnDefinition = "bit(1) default 0")
    private Boolean isDelete;
    @Column(columnDefinition = "text")
    private String detail;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<Cart> cartList;


}
