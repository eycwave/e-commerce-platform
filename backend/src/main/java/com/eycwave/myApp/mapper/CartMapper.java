package com.eycwave.myApp.mapper;

import com.eycwave.myApp.dto.CartDto;
import com.eycwave.myApp.dto.response.CartResponse;
import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.service.ProductService;
import com.eycwave.myApp.utils.CommonUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {
    private final ProductService productService;

    public CartMapper(ProductService productService) {
        this.productService = productService;
    }

    public CartDto convertToDto(Cart cart) {
        String[] uuids = CommonUtils.commaSeparatedStringToArray(cart.getProductUUIDs());

        List<Product> productList = Arrays.stream(uuids)
                .filter(uuid -> !uuid.isEmpty())
                .map(uuid -> productService.getProductByUuid(uuid))
                .collect(Collectors.toList());

        CartDto cartDto = new CartDto();
        BeanUtils.copyProperties(cart, cartDto);
        cartDto.setProductUuids(uuids); // Set all UUIDs including empty ones
        cartDto.setProductList(productList); // Set only products for non-empty UUIDs
        return cartDto;
    }


}
