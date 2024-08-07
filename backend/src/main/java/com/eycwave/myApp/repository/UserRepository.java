package com.eycwave.myApp.repository;

import java.util.Optional;

import com.eycwave.myApp.model.Product;
import com.eycwave.myApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Product> findByUuid(String uuid);

}
