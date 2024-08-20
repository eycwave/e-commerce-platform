package com.eycwave.myApp.kafka;

import com.eycwave.myApp.model.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.kafka.annotation.KafkaListener;

@Component
@RequiredArgsConstructor
public class KafkaOrderConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "orders", groupId = "order-group")
    public void listen(OrderDto order) {
        messagingTemplate.convertAndSend("/topic/orders", order);
    }
}
