package com.eycwave.myApp.service;

import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.enums.OrderStatus;
import com.eycwave.myApp.mapper.OrderMapper;
import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.Order;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.repository.CartRepository;
import com.eycwave.myApp.repository.OrderRepository;
import com.eycwave.myApp.repository.ProductRepository;
import com.eycwave.myApp.repository.UserRepository;
import com.eycwave.myApp.utils.CommonUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;


    private final OrderMapper orderMapper;

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::convertToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrdersByUserUuid(String userUuid) {
        List<Order> orders = orderRepository.findByUserUuid(userUuid);
        return orders.stream()
                .map(orderMapper::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto saveOrder(OrderDto orderDto) {
        Cart cart = cartRepository.findByUserUuid(orderDto.getUserUuid())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        String[] productUuids = CommonUtils.commaSeparatedStringToArray(cart.getProductUUIDs());
        List<Product> productList = new ArrayList<>();
        double totalAmount = 0.0;

        for (String productUuid : productUuids) {
            Product product = productRepository.findByUuid(productUuid)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            productList.add(product);
            totalAmount += product.getPrice();
        }

        Order order = Order.builder()
                .uuid(UUID.randomUUID().toString())
                .orderNumber(LocalDate.now().toString().replace("-", "") + UUID.randomUUID().toString().substring(0, 8))
                .orderDate(new Timestamp(System.currentTimeMillis()))
                .totalAmount(totalAmount)
                .orderStatus(OrderStatus.PROCESSING.name())
                .user(cart.getUser())
                .productList(productList)
                .build();

        Order savedOrder = orderRepository.save(order);
        return orderMapper.convertToDto(savedOrder);
    }





}
