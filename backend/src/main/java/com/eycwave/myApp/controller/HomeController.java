package com.eycwave.myApp.controller;

import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    private final ProductService productService;

    public HomeController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> home() {
        // Other stuff can be add ...

        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
}
