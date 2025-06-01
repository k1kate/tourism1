package com.example.tourism.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Entity
@Table(name = "excursioncommon")
@Data
public class ExcursionCommon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @OneToMany(mappedBy = "excursionCommon", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference("excursion-tags")
    private List<ExcursionTag> tags;

    @OneToMany(mappedBy = "excursionCommon", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference("excursion-places")
    private List<Excursion> places;

    @Override
    public String toString() {
        return "ExcursionCommon{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", tags='" + tags + '\'' +
                ", places='" + places + '\'' +
                ", author='" + author + '\'' +
                '}';
    }

    private String author;
}
