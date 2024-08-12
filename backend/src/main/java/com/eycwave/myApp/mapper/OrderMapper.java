package com.eycwave.myApp.mapper;

import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.model.Order;
import com.eycwave.myApp.service.ProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {
    private final ProductService productService;


    public OrderMapper(ProductService productService) {
        this.productService = productService;
    }

    public OrderDto convertToDto(Order order) {
        List<String> uuids = order.getProductList().stream()
                .map(product -> productService.getProductByUuid(product.getUuid()).getUuid())
                .collect(Collectors.toList());

        OrderDto orderDto = new OrderDto();
        BeanUtils.copyProperties(order, orderDto);
        orderDto.setProductUuids(uuids);
        orderDto.setUserUuid(order.getUser().getUuid());
        return orderDto;
    }
}