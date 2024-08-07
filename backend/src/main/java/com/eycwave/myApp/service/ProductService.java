package com.eycwave.myApp.service;

import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        product.setUuid(UUID.randomUUID().toString());
        product.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return productRepository.save(product);
    }
}
