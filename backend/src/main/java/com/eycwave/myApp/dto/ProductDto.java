package com.eycwave.myApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private String name;
    private String uuid;
    private String description;
    private Double price;
    private Timestamp createdAt;
    private String image;
}