package com.example.tourism.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "excursion_tag")
@Data
public class ExcursionTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;

    @ManyToOne
    @JoinColumn(name = "excursion_common_id")
    @com.fasterxml.jackson.annotation.JsonBackReference("excursion-tags")
    private ExcursionCommon excursionCommon;

    @com.fasterxml.jackson.annotation.JsonCreator
    public static ExcursionTag fromString(String name) {
        ExcursionTag tag = new ExcursionTag();
        tag.setTag(name);
        return tag;
    }

    @Override
    public String toString() {
        return "ExcursionTag{" + "tag='" + tag + '\'' + '}';
    }

    public String getTags() {
        return tag;
    }
}
