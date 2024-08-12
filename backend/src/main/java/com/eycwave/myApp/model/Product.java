package com.eycwave.myApp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;
    private String name;
    private String uuid;
    private String description;
    private Double price;
    private Timestamp createdAt;
    private String image;

    // Relations
    @ManyToMany(mappedBy = "productList")
    private List<Order> orderList;

}