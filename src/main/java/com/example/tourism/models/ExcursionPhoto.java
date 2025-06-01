package com.example.tourism.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "excursion_photo")
@Data
public class ExcursionPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String photoPath;

    @ManyToOne
    @JoinColumn(name = "excursion_id")
    @JsonBackReference
    private Excursion excursion;

    @JsonCreator
    public static ExcursionPhoto fromString(String name) {
        ExcursionPhoto ph = new ExcursionPhoto();
        ph.setPhotoPath(name);
        return ph;
    }

    @Override
    public String toString() {
        return "Excursionphoto{" + "photo=" + photoPath + "}";
    }


    public String getPath() {
        return photoPath;
    }
}
