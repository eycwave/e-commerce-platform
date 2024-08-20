package com.eycwave.myApp.controller;

import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userUuid}")
    public ResponseEntity<List<OrderDto>> getAllOrdersByUserUuid(@PathVariable String userUuid) {
        return ResponseEntity.ok(orderService.getAllOrdersByUserUuid(userUuid));
    }

    @PostMapping("/save")
    public ResponseEntity<OrderDto> saveOrder(@RequestBody OrderDto orderDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.saveOrder(orderDto));
    }

    @PutMapping("/change-status/{orderUuid}")
    public ResponseEntity<OrderDto> changeOrderStatus(@PathVariable String orderUuid) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.changeOrderStatusByUuid(orderUuid));
    }



}
