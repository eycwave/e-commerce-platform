package com.eycwave.myApp.kafka;

import com.eycwave.myApp.model.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaOrderConsumer {

    @KafkaListener(topics = "orders", groupId = "order-group")
    public void listen(OrderDto orderDto) {
        // WEB SOCKET INTEGRATION ...

        System.out.println("new order: " + orderDto);
    }
}
