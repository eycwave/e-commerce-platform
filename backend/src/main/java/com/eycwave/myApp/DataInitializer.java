package com.eycwave.myApp;

import com.eycwave.myApp.enums.Role;
import com.eycwave.myApp.kafka.BotService;
import com.eycwave.myApp.model.User;
import com.eycwave.myApp.model.dto.OrderDto;
import com.eycwave.myApp.repository.UserRepository;
import com.eycwave.myApp.service.CartService;
import com.eycwave.myApp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartService cartService;

    @Autowired
    private BotService botService;

    @Bean
    // It initializes ADMIN and BOT profiles.
    public CommandLineRunner init() {
        return args -> {
            if (userRepository.findByEmail("admin").isEmpty()) {
                User admin = new User();
                admin.setUuid(UUID.randomUUID().toString());
                admin.setFirstname("ADMIN");
                admin.setLastname("ADMIN");
                admin.setAge(30L);
                admin.setDepartment("Administration");
                admin.setEmail("admin");
                admin.setPassword(passwordEncoder.encode("123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                cartService.saveCart(admin.getUuid());
            }
            if(!botService.anyExist()){
                botService.saveBotsToDB();
            }
        };
    }
}
