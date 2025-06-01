package com.example.tourism.repository;

import com.example.tourism.models.Excursion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExcursionRepository extends JpaRepository<Excursion, Long> {



    List<Excursion> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);

    List<Excursion> findByExcursionCommonId(Long excursionId);
}
