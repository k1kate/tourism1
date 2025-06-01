package com.example.tourism.service;

import com.example.tourism.models.Excursion;
import com.example.tourism.models.ExcursionCard;
import com.example.tourism.models.ExcursionCommon;
import com.example.tourism.models.ExcursionPhoto;
import com.example.tourism.repository.ExcursionCommonRepository;
import com.example.tourism.repository.ExcursionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;


@Service
@RequiredArgsConstructor
public class ExcursionService {

    private final ExcursionCommonRepository excursionCommonRepository;
    private final ExcursionRepository excursionRepository;

    @Value("${dadata.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    public Double[] getcoords(String address) {
        String url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.set("Authorization", "Token " + apiKey);

        Map<String, String> body = Map.of("query", address);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        var suggestions = (java.util.List<Map<String, Object>>) response.getBody().get("suggestions");
        if (suggestions != null && !suggestions.isEmpty()) {
            Map<String, Object> location = (Map<String, Object>) suggestions.get(0).get("data");
            Double lat = Double.valueOf((String) location.get("geo_lat"));
            Double lon = Double.valueOf((String) location.get("geo_lon"));
            return new Double[] { lat, lon };
        } else {
            return null;
        }


    }

    public List<String> uploadphoto(MultipartFile[] files) {
        List<String> fileName = new ArrayList<>();
        try {
            for(MultipartFile file : files) {
                UUID Uuid_name = UUID.randomUUID();
                String fileType = file.getContentType().split("/")[1];
                String newFileName = Uuid_name + "." + fileType;
                file.getOriginalFilename().replace(file.getOriginalFilename(), newFileName);

                // Путь к папке uploads в текущей рабочей директории
                String p = System.getProperty("user.dir");
                System.out.println(p);
                Path uploadDir = Paths.get(p+ "/uploads");

                System.out.println(uploadDir);
                // Создаём папку, если нет
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Путь к файлу, куда сохраняем
                Path filePath = uploadDir.resolve(newFileName);

                // Сохраняем файл
                file.transferTo(filePath.toFile());

                fileName.add(newFileName);

            }
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
        return fileName;

    }

    public List<ExcursionCard> getexccomm(List<ExcursionCommon> excursionCommon) {
        excursionCommon.sort(Comparator.comparing(ExcursionCommon::getId).reversed());
        List<ExcursionCard> new_ex = new ArrayList<>();
        System.out.println(excursionCommon);
        for (ExcursionCommon s : excursionCommon) {
            ExcursionCard extemp = new ExcursionCard();
            extemp.setId(s.getId());
            extemp.setTitle(s.getTitle());
            extemp.setTags(s.getTags());
            String photoPath = null;
            extemp.setAuthor(s.getAuthor());

            if (s.getPlaces() != null && !s.getPlaces().isEmpty()) {
                Excursion firstPlace = s.getPlaces().get(0);
                if (firstPlace.getPhotoPaths() != null && !firstPlace.getPhotoPaths().isEmpty()) {
                    photoPath = firstPlace.getPhotoPaths().get(0).getPhotoPath();
                } else {
                    photoPath = "default.jpg";
                }
            } else {
                photoPath = "default.jpg";
            }

            extemp.setPhotoPaths(photoPath);
            extemp.setDescription(s.getDescription());
            new_ex.add(extemp);
        }

        return  new_ex;
    }

    public void createexc(Excursion excursion, Long id_comm) {
        excursion.setId(null);

        if (excursion.getPhotoPaths() != null) {
            for (ExcursionPhoto photo : excursion.getPhotoPaths()) {
                photo.setExcursion(excursion);
            }
        }

        Double[] coords = getcoords(excursion.getLocation());

        System.out.println(coords);

        excursion.setLatitude(coords[0]);
        excursion.setLongitude(coords[1]);

        ExcursionCommon excursioncomm = excursionCommonRepository.findById(id_comm)
                .orElseThrow(() -> new RuntimeException("Экскурсия не найдена"));
        excursion.setExcursionCommon(excursioncomm);

        Excursion ex =  excursionRepository.save(excursion);

    }

}
