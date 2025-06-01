package com.example.tourism.controllers;

import com.example.tourism.models.*;
import com.example.tourism.repository.ExcursionCommonRepository;
import com.example.tourism.repository.ExcursionRepository;
import com.example.tourism.repository.UserRepository;
import com.example.tourism.service.ExcursionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class MainController {

    private final ExcursionRepository excursionRepository;
    private final UserRepository userRepository;
    private final ExcursionService excursionService;
    private final ExcursionCommonRepository excursionCommonRepository;

    @Value("${dadata.api.key}")
    private String dadataApiKey;


    @GetMapping("/excursions/{id}")
    public String excursionsPage(@PathVariable("id") Long id_comm, Principal principal, Model model) {
        if (principal == null) {
            return "redirect:/login";
        }
        String fullname = userRepository.findByUsername(principal.getName())
                .map(u -> u.getLastname() + " " + u.getFirstname() + " " + u.getMiddlename())
                .orElse("юзер неизвестен");
        model.addAttribute("fullname", fullname);
        model.addAttribute("dadataApiKey", dadataApiKey);

        ExcursionCommon excursioncomm = excursionCommonRepository.findById(id_comm)
                .orElseThrow(() -> new RuntimeException("Экскурсия не найдена"));

        model.addAttribute("excursioncomm", excursioncomm);

        return "excursions";

    }

    @GetMapping("/getexccomm/{id}")
    @ResponseBody
    public ExcursionCommon getexccom(@PathVariable("id") Long id_comm, Principal principal) {
        if (principal == null) {
            return new ExcursionCommon();
        }

        ExcursionCommon excursioncomm = excursionCommonRepository.findById(id_comm)
                .orElseThrow(() -> new RuntimeException("Экскурсия не найдена"));

        return excursioncomm;

    }

    @GetMapping("/")
    public String excursionsPage(Principal principal, Model model) {
        if (principal == null) {
            return "redirect:/login";
        }
        String fullname = userRepository.findByUsername(principal.getName())
                .map(u -> u.getLastname() + " " + u.getFirstname() + " " + u.getMiddlename())
                .orElse("юзер неизвестен");
        model.addAttribute("fullname", fullname);
        model.addAttribute("dadataApiKey", dadataApiKey);

        return "excursionsCommon";

    }

    @GetMapping("/excursionsCommon")
    public String excursionsCommonPage(Principal principal, Model model) {
        if (principal == null) {
            return "redirect:/login";
        }
        String fullname = userRepository.findByUsername(principal.getName())
                .map(u -> u.getLastname() + " " + u.getFirstname() + " " + u.getMiddlename())
                .orElse("юзер неизвестен");
        model.addAttribute("fullname", fullname);
        model.addAttribute("dadataApiKey", dadataApiKey);

        return "excursionsCommon";

    }


    @PostMapping("/dpPlaceHolder")
    @ResponseBody
    public  ResponseEntity<String> placeHolder(@RequestParam("file")MultipartFile file){
        long FileSize =  file.getSize();
        return ResponseEntity.ok("size of file: " + FileSize);
    }



    @PostMapping("/upload")
    @ResponseBody
    public List<String> handleUpload(@RequestParam("file") MultipartFile[] files) {
        List<String> fileName = excursionService.uploadphoto(files);
        return fileName;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteImage(@RequestParam String filename) {
        Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");
        Path filePath = uploadDir.resolve(filename);
        try {
            Files.deleteIfExists(filePath);
            return ResponseEntity.ok("Удалено");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка удаления");
        }
    }


    @PostMapping("excursionsCommon/createexc/{id}")
    @ResponseBody
    public String excursionsAdd(@RequestBody Excursion excursion, @PathVariable("id") Long id_comm, Principal principal) {

        excursionService.createexc(excursion, id_comm);
        return "ok";
    }

    @PostMapping("createExcursionsCommon")
    @ResponseBody
    public String excursionsCommonAdd(@RequestBody ExcursionCommon excursionCommon, Principal principal, Model model) {
        String name = principal.getName();
        String author = userRepository.findByUsername(name)
                .map(u -> u.getLastname() + " " + u.getFirstname() + " " + u.getMiddlename())
                .orElse("юзер неизвестен");

        excursionCommon.setId(null);

        excursionCommon.setAuthor(author);

        if (excursionCommon.getTags() != null) {
            for (ExcursionTag tag : excursionCommon.getTags()) {
                tag.setExcursionCommon(excursionCommon);
            }
        }


        ExcursionCommon ex =  excursionCommonRepository.save(excursionCommon);

        return "ok";

    }



    @GetMapping("/allexcursionsbyid/{id}")
    @ResponseBody
    public List<ExcursionCard> getexcursions(@PathVariable("id") Long id_comm, Principal principal) {
        if (principal == null) {
            return Collections.emptyList();
        }
        List<Excursion> ex = excursionRepository.findByExcursionCommonId(id_comm);
        ex.sort(Comparator.comparing(Excursion::getId).reversed());
        List<ExcursionCard> new_ex = new ArrayList<>();
        for (Excursion s : ex) {
            ExcursionCard extemp = new ExcursionCard();
            extemp.setId(s.getId());
            extemp.setTitle(s.getTitle());
            extemp.setLocation(s.getLocation());
            extemp.setPhotoPaths(s.getPhotoPaths().get(0).getPhotoPath());
            extemp.setLatitude(s.getLatitude());
            extemp.setLongitude(s.getLongitude());
            new_ex.add(extemp);
        }
        return new_ex;
    }

    @GetMapping("/allexcursionscommon")
    @ResponseBody
    public List<ExcursionCard> getexcursionscommon(Principal principal) {
        if (principal == null) {
            return Collections.emptyList();
        }
        List<ExcursionCommon> ex = excursionCommonRepository.findAll();
        List<ExcursionCard> new_ex = excursionService.getexccomm(ex);
        return new_ex;
    }




    @PostMapping("/searchtagscomm")
    @ResponseBody
    public List<ExcursionCard> searchexccomm(@RequestBody List<String> tags, Principal principal) {
        if (principal == null) {
            return Collections.emptyList();
        }
        List<ExcursionCommon> ex;
        if(tags.isEmpty()) {
            ex = excursionCommonRepository.findAll();
        }else {
            ex = excursionCommonRepository.findByAllTags(tags, tags.size());
        }
        List<ExcursionCard> new_ex = excursionService.getexccomm(ex);


        return new_ex;
    }



    @GetMapping("/searchcomm/{query}")
    @ResponseBody
    public List<ExcursionCard> searchcomm(@PathVariable String query, Principal principal) {
        if (principal == null) {
            return Collections.emptyList();
        }
        List<ExcursionCommon> ex;
        if(query == null || query.trim().isEmpty()) {
            ex = excursionCommonRepository.findAll();
        }else {
            ex = excursionCommonRepository.findByTitleContainingIgnoreCase(query);
        }
        List<ExcursionCard> new_ex = excursionService.getexccomm(ex);
        return new_ex;
    }

    @GetMapping("/getexcursion/{id}")
    @ResponseBody
    public ExcursionCardFull getexcursion(Principal principal, @PathVariable Long id) {
        if (principal == null) {
            return new ExcursionCardFull();
        }
        Excursion excursion = excursionRepository.findById(id).orElseThrow(() -> new RuntimeException("Exc not found"));
        ExcursionCardFull new_exc = new ExcursionCardFull();

        new_exc.setTitle(excursion.getTitle());
        new_exc.setId(excursion.getId());
        new_exc.setDescription(excursion.getDescription());
        new_exc.setLocation(excursion.getLocation());
        new_exc.setLatitude(excursion.getLatitude());
        new_exc.setLongitude(excursion.getLongitude());
        List<String> paths = excursion.getPhotoPaths()
                .stream()
                .map(ExcursionPhoto::getPath)
                .collect(Collectors.toList());

        new_exc.setPhotoPaths(paths);


        return new_exc;
    }

    @DeleteMapping("/delexc/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteExcursion(@PathVariable Long id) {
        Optional<Excursion> excursionOpt = excursionRepository.findById(id);
        if (excursionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Excursion excursion = excursionOpt.get();

        for (ExcursionPhoto photo : excursion.getPhotoPaths()) {
            String path = photo.getPath();

            File file = new File("uploads/" + path);
            if (file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    System.err.println("Не удалось удалить файл: " + path);
                }
            }
        }

        excursionRepository.delete(excursion);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteexccomm/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteExcursioncomm(@PathVariable Long id) {
        Optional<ExcursionCommon> excursionCommon = excursionCommonRepository.findById(id);
        if (excursionCommon.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ExcursionCommon excursionCommon1 = excursionCommon.get();


        excursionCommonRepository.delete(excursionCommon1);

        return ResponseEntity.ok().build();
    }


}
