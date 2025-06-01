package com.example.tourism.repository;

import com.example.tourism.models.Excursion;
import com.example.tourism.models.ExcursionCommon;
import com.example.tourism.models.ExcursionPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExcursionCommonRepository extends JpaRepository<ExcursionCommon, Long> {

    @Query("""
        SELECT e FROM ExcursionCommon e
        JOIN e.tags t
        WHERE t.tag IN :tagList
        GROUP BY e
        HAVING COUNT(DISTINCT t.tag) = :tagCount
        """)
    List<ExcursionCommon> findByAllTags(@Param("tagList") List<String> tagList, @Param("tagCount") long tagCount);

    List<ExcursionCommon> findByTitleContainingIgnoreCase(String title);
}
