package com.eycwave.myApp.service;

import com.eycwave.myApp.model.dto.CartDto;
import com.eycwave.myApp.model.dto.response.CartResponse;
import com.eycwave.myApp.mapper.CartMapper;
import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.model.User;
import com.eycwave.myApp.repository.CartRepository;
import com.eycwave.myApp.repository.ProductRepository;
import com.eycwave.myApp.repository.UserRepository;
import com.eycwave.myApp.utils.CommonUtils;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class CartService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final ProductRepository productRepository;

    public CartService(UserRepository userRepository, CartRepository cartRepository, CartMapper cartMapper, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartMapper = cartMapper;
        this.productRepository = productRepository;
    }

    @Transactional
    public CartResponse saveCart(String userUuid) {
        Optional<User> user = userRepository.findByUuid(userUuid);
        Cart cart = Cart.builder()
                .uuid(UUID.randomUUID().toString())
                .orderDate(new Timestamp(System.currentTimeMillis()))
                .user(user.orElseThrow(() -> new RuntimeException("User not found")))
                .productUUIDs("")
                .build();
        cartRepository.save(cart);
        return createResponse(cart);
    }

    @Transactional
    public CartResponse resetCart(String userUuid) {
        Cart cart = cartRepository.findByUserUuid(userUuid)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cart.setProductUUIDs("");
        cartRepository.save(cart);
        CartDto cartDto = cartMapper.convertToDto(cart);
        cartDto.setProductUuids(new String[0]);
        cartDto.setProductList(new ArrayList<>());
        return createResponse(cart);
    }


    @Transactional
    public CartResponse updateCart(CartDto cartDto, String cartUuid) {
        Cart cart = cartRepository.findByUuid(cartUuid)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<String> validProductUuids = new ArrayList<>();
        for (String productUuid : cartDto.getProductUuids()) {
            if (productRepository.existsByUuid(productUuid)) {
                validProductUuids.add(productUuid);
            } else {
                throw new RuntimeException("Product with UUID " + productUuid + " not found");
            }
        }
        cart.setProductUUIDs(CommonUtils.arrayToCommaSeparatedString(validProductUuids.toArray(new String[0])));
        cartRepository.save(cart);
        return createResponse(cart);
    }

    @Transactional
    public void deleteCart(String cartUuid) {
        cartRepository.findByUuid(cartUuid)
                .ifPresent(cartRepository::delete);
    }

    public CartDto getCartByUserUuid(String userUuid) {
        return cartRepository.findByUserUuid(userUuid)
                .map(cartMapper::convertToDto)
                .orElseThrow(() -> new NoSuchElementException("Cart not found for User UUID: " + userUuid));
    }


    public CartResponse createResponse(Cart cart) {
        CartResponse cartResponse = new CartResponse();
        if (cart != null) {
            String[] productUuids = CommonUtils.commaSeparatedStringToArray(cart.getProductUUIDs());
            Double totalPrice = Arrays.stream(productUuids)
                    .filter(uuid -> !uuid.trim().isEmpty())
                    .mapToDouble(uuid -> productRepository.findByUuid(uuid)
                            .map(Product::getPrice)
                            .orElse(0.0))
                    .sum();
            cartResponse.setTotalPrice(totalPrice);
        }
        return cartResponse;
    }



}