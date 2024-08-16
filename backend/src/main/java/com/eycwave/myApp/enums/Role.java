package com.eycwave.myApp.enums;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequiredArgsConstructor
public enum Role {

    USER,
    BOT,
    ADMIN;

    public List<SimpleGrantedAuthority> getAuthorities() {
        return Stream.of(new SimpleGrantedAuthority("ROLE_" + this.name()))
                .collect(Collectors.toList());
    }
}
