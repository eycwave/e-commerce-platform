package com.eycwave.myApp.kafka;

import com.eycwave.myApp.enums.Role;
import com.eycwave.myApp.mapper.CartMapper;
import com.eycwave.myApp.mapper.ProductMapper;
import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.model.User;
import com.eycwave.myApp.model.dto.CartDto;
import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.model.dto.ProductDto;
import com.eycwave.myApp.model.dto.request.LoginRequest;
import com.eycwave.myApp.model.dto.response.AuthenticationResponse;
import com.eycwave.myApp.repository.CartRepository;
import com.eycwave.myApp.repository.ProductRepository;
import com.eycwave.myApp.service.CartService;
import com.eycwave.myApp.service.OrderService;
import com.eycwave.myApp.repository.UserRepository;
import com.eycwave.myApp.service.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.Uuid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BotService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final OrderService orderService;
    private final KafkaOrderProducer kafkaOrderProducer;
    private final CartMapper cartMapper;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final AuthenticationService authenticationService;

    public BotService(PasswordEncoder passwordEncoder, UserRepository userRepository, CartService cartService, OrderService orderService, KafkaOrderProducer kafkaOrderProducer, CartMapper cartMapper, CartRepository cartRepository, ProductRepository productRepository, ProductMapper productMapper, AuthenticationService authenticationService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.orderService = orderService;
        this.kafkaOrderProducer = kafkaOrderProducer;
        this.cartMapper = cartMapper;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.authenticationService = authenticationService;
    }

    public String placeOrdersForBots() {
        boolean allSuccessful = true;
        StringBuilder errorMessages = new StringBuilder();

        try {
            List<User> bots = getAllBots();
            Product product = productRepository.findByUuid("b904a985-9848-46d6-9835-f89a63857423").get();
            ProductDto productDto = productMapper.convertToDto(product);
            String[] productUuids = {"b904a985-9848-46d6-9835-f89a63857423", "b904a985-9848-46d6-9835-f89a63857423"};

            List<ProductDto> productDtoList = new ArrayList<>();
            productDtoList.add(productDto);
            productDtoList.add(productDto);

            for (User bot : bots) {
                try {
                    String botUuid = bot.getUuid();
                    Cart currentCart = cartRepository.findByUserUuid(botUuid)
                            .orElseThrow(() -> new RuntimeException("Cart not found for bot: " + botUuid));
                    CartDto cartDto = cartMapper.convertToDto(currentCart);

                    cartDto.setProductUuids(productUuids);
                    cartDto.setProductList(productDtoList);

                    cartService.updateCart(cartDto, currentCart.getUuid());

                    OrderDto orderDto = new OrderDto();
                    orderDto.setUserUuid(botUuid);
                    orderService.saveOrder(orderDto);
                } catch (Exception e) {
                    allSuccessful = false;
                    errorMessages.append("Error processing order for bot: ").append(bot.getUuid()).append(". ").append(e.getMessage()).append("\n");
                }
            }
            if (allSuccessful) {
                return "Orders placed successfully for all bots";
            } else {
                return "Failed to place orders for some bots:\n" + errorMessages.toString();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to place orders for bots";
        }
    }

    public String saveBotsToDB(int count) {
        try {
            for (int i = 1; i <= count; i++) {
                String botName = "Bot" + i;
                User bot = new User();
                bot.setUuid(UUID.randomUUID().toString());
                bot.setFirstname(botName);
                bot.setLastname("BOT");
                bot.setAge(30L);
                bot.setDepartment("BOT_PROFILE");
                String email = Uuid.randomUuid().toString();
                bot.setEmail(email);
                bot.setPassword(passwordEncoder.encode("123"));
                bot.setRole(Role.BOT);
                userRepository.save(bot);

                cartService.saveCart(bot.getUuid());
            }
            return "Bots saved successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to save bots.";
        }
    }

    public List<User> getAllBots() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.BOT)
                .collect(Collectors.toList());
    }

    public boolean anyExist() {
        return userRepository.existsByRole(Role.BOT);
    }

}
