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
    private long id;
    private String name;
    private String uuid;
    private String description;
    private double price;
    private Timestamp createdAt;
/*
    // Relations
    @ManyToMany(mappedBy = "productList")
    private List<Order> orderList;
*/
}