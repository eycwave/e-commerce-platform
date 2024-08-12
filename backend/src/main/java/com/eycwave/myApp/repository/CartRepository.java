package com.eycwave.myApp.repository;

import com.eycwave.myApp.model.Cart;
import com.eycwave.myApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUuid(String cartUuid);
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserUuid(String userUuid);
}