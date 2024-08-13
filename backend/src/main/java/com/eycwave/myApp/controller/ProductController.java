package com.eycwave.myApp.controller;

import com.eycwave.myApp.model.dto.ProductDto;
import com.eycwave.myApp.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);

    }

    @GetMapping("/get/{productUuid}")
    public ResponseEntity<ProductDto> getProductByUuid(@PathVariable String productUuid) {
        return new ResponseEntity<>(productService.getProductByUuid(productUuid), HttpStatus.OK);

    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto productDto) {
        return new ResponseEntity<>(productService.saveProduct(productDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{productUuid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String productUuid) {
        productService.deleteProduct(productUuid);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
