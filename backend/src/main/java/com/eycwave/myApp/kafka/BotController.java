package com.eycwave.myApp.kafka;

import com.eycwave.myApp.model.dto.CartDto;
import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.model.dto.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bots")
public class BotController {

    private final BotService botService;

    public BotController(BotService botService) {
        this.botService = botService;
    }

    @PostMapping("/place-orders")
    public ResponseEntity<String> placeOrders() {
        String result = botService.placeOrdersForBots();
        if (result.startsWith("Failed to place orders for some bots")) {
            return new ResponseEntity<>(result, HttpStatus.PARTIAL_CONTENT);
        } else if (result.startsWith("Failed")) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

}
