package com.eycwave.myApp.security.auth;

import com.eycwave.myApp.model.User;
import com.eycwave.myApp.repository.UserRepository;
import com.eycwave.myApp.security.config.JwtService;
import com.eycwave.myApp.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException();
        }
        var user = User.builder()
                .uuid(UUID.randomUUID().toString())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .age(request.getAge())
                .department(request.getDepartment())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user,user.getUuid());

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user,user.getUuid());

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

}
