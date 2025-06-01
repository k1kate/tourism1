package com.example.tourism.models;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ExcursionCard {
    private Long id;
    private String title;
    private List<String> tags;
    private String photoPaths;
    private String location;
    private Double latitude;
    private Double longitude;
    private String description;
    private String author;

    public void setTags(List<ExcursionTag> tags) {
        List<String> newtags = new ArrayList<>();
        for(ExcursionTag t: tags) {
            newtags.add(t.getTag());
        }
        this.tags = newtags;
    }
}
