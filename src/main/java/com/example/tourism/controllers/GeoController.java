package com.example.tourism.controllers;

import com.example.tourism.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class GeoController {

        private final UserRepository userRepository;

        @Value("${yandex.api.key}")
        private String yandexApiKey;

        @Value("${openrouteservice.api-key}")
        private String orsApiKey;




        private final RestTemplate restTemplate = new RestTemplate();


        @GetMapping("/map")
        public String mainPage(Principal principal, Model model) {
            if (principal == null) {
                return "redirect:/login";
            }
            String fullname = userRepository.findByUsername(principal.getName())
                    .map(u -> u.getLastname() + " " + u.getFirstname() + " " + u.getMiddlename())
                    .orElse("юзер неизвестен");
            model.addAttribute("fullname", fullname);
            model.addAttribute("yandexApiKey", yandexApiKey);
            model.addAttribute("orsApiKey", orsApiKey);
            return "main";

        }



        @GetMapping("/route")
        public ResponseEntity<String> getRoute(@RequestParam double startLon, @RequestParam double startLat,
                                               @RequestParam double endLon, @RequestParam double endLat, @RequestParam boolean car) {
            String url;
            if (car) {
                url = "https://api.openrouteservice.org/v2/directions/driving-car?geometry_format=encodedpolyline";
            }else {
                url = "https://api.openrouteservice.org/v2/directions/foot-walking?geometry_format=encodedpolyline";
            }


            // Тело запроса с координатами (долгота, широта)
            Map<String, Object> body = Map.of(
                    "coordinates", new double[][]{
                            {startLon, startLat},
                            {endLon, endLat}
                    }
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", orsApiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            try {
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    return ResponseEntity.ok(response.getBody());
                } else {
                    return ResponseEntity.status(response.getStatusCode()).body("Error from ORS: " + response.getBody());
                }

            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Exception during ORS request: " + e.getMessage());
            }
        }



}
