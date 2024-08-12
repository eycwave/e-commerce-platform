package com.eycwave.myApp.mapper;

import com.eycwave.myApp.model.dto.CartDto;
import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.repository.ProductRepository;
import com.eycwave.myApp.utils.CommonUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CartMapper {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public CartMapper(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public CartDto convertToDto(Cart cart) {
        String[] uuids = CommonUtils.commaSeparatedStringToArray(cart.getProductUUIDs());

        List<Product> productList = Arrays.stream(uuids)
                .filter(uuid -> !uuid.isEmpty())
                .map(productRepository::findByUuid)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        CartDto cartDto = new CartDto();
        BeanUtils.copyProperties(cart, cartDto);
        cartDto.setProductUuids(uuids); // Set all UUIDs including empty ones
        cartDto.setProductList(productMapper.convertAllToDto(productList)); // Set list of ProductDto
        return cartDto;
    }
}
