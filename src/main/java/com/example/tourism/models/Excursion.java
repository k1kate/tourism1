package com.example.tourism.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "excursion")
@Data
public class Excursion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;


    @OneToMany(mappedBy = "excursion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExcursionPhoto> photoPaths;

    @Override
    public String toString() {
        return "Excursion{" + "id=" + id + ", tags=" + "photo =" + photoPaths + "}";
    }

    @ManyToOne
    @JoinColumn(name = "excursion_id_common")
    @com.fasterxml.jackson.annotation.JsonBackReference("excursion-places")
    private ExcursionCommon excursionCommon;


}
