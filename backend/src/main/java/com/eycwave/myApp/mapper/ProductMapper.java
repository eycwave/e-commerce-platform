package com.eycwave.myApp.mapper;

import com.eycwave.myApp.dto.ProductDto;
import com.eycwave.myApp.model.Product;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto convertToDto(Product product) {
        ProductDto productDto = new ProductDto();
        BeanUtils.copyProperties(product, productDto);
        return productDto;
    }

    public Product convertToEntity(ProductDto productDto){
        return Product.builder()
                .name(productDto.getName())
                .uuid(productDto.getUuid())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .createdAt(productDto.getCreatedAt())
                .image(productDto.getImage())
                .build();
    }

}
