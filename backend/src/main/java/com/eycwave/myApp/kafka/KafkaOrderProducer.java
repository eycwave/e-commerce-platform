package com.eycwave.myApp.kafka;

import com.eycwave.myApp.enums.Role;
import com.eycwave.myApp.model.User;
import com.eycwave.myApp.model.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class KafkaOrderProducer {
    private final KafkaTemplate<String, OrderDto> kafkaTemplate;

    public void sendOrder(String topic, OrderDto orderDto) {
        kafkaTemplate.send(topic, orderDto);
    }
}
