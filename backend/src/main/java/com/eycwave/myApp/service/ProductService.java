package com.eycwave.myApp.service;

import com.eycwave.myApp.model.dto.ProductDto;
import com.eycwave.myApp.mapper.ProductMapper;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(productMapper::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto saveProduct(ProductDto productDto) {
        productDto.setUuid(UUID.randomUUID().toString());
        productDto.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        Product savedProduct = productRepository.save(productMapper.convertToEntity(productDto));
        return productMapper.convertToDto(savedProduct);
    }

    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            productRepository.delete(optionalProduct.get());
        } else {
            throw new NoSuchElementException("Product with ID " + id + " not found.");
        }
    }

    public ProductDto getProductByUuid(String uuid) {
        Product product = productRepository.findByUuid(uuid)
                .orElseThrow(() -> new NoSuchElementException("Product not found with UUID: " + uuid));
        return productMapper.convertToDto(product);
    }
}
