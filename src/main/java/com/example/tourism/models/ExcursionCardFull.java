package com.example.tourism.models;

import lombok.Data;

import java.util.List;

@Data
public class ExcursionCardFull {
    private Long id;
    private String title;
    private List<String> tags;
    private List<String> photoPaths;
    private String location;
    private String description;
    private String author;
    private Double latitude;
    private Double longitude;
}
