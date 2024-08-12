package com.eycwave.myApp.controller;

import com.eycwave.myApp.dto.CartDto;
import com.eycwave.myApp.dto.response.CartResponse;
import com.eycwave.myApp.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")

public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/save/{userUuid}")
    public ResponseEntity<CartResponse> saveCart(@PathVariable String userUuid) {
        return new ResponseEntity<>(cartService.saveCart(userUuid), HttpStatus.CREATED);
    }

    @PutMapping("/reset/{userUuid}")
    public ResponseEntity<CartResponse> resetCart(@PathVariable String userUuid) {
        cartService.resetCart(userUuid);
        return new ResponseEntity<>(cartService.resetCart(userUuid), HttpStatus.OK);
    }

    @PutMapping("/update/{cartUuid}")
    public ResponseEntity<CartResponse> updateCart(@PathVariable String cartUuid, @RequestBody CartDto cartDto) {
        return new ResponseEntity<>(cartService.updateCart(cartDto, cartUuid), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{cartUuid}")
    public ResponseEntity<String> deleteCart(@PathVariable String cartUuid) {
        cartService.deleteCart(cartUuid);
        return new ResponseEntity<>("Cart successfully deleted", HttpStatus.OK);
    }

    @GetMapping("/user/{userUuid}")
    public ResponseEntity<CartDto> getCartByUserUuid(@PathVariable String userUuid) {
        return new ResponseEntity<>(cartService.getCartByUserUuid(userUuid), HttpStatus.OK);
    }
}