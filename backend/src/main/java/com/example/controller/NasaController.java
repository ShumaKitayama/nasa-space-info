package com.example.controller;

import com.example.nasainfo.NasaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class NasaController {

    private final NasaService nasaService;

    private static final Logger logger = LoggerFactory.getLogger(NasaService.class);

    @Value("${nasa.api.key}")
    private String apiKey;


    public NasaController(NasaService nasaService) {
        this.nasaService = nasaService;
    }

    @GetMapping("/astronomy-picture")
    public Mono<String> getAstronomyPicture() {
        return nasaService.getAstronomyPicture(apiKey);
    }

    @GetMapping("/mars-rover")
    public Mono<String> getMarsRoverPhotos() {
        return nasaService.getMarsRoverPhotos(apiKey);
    }

    @GetMapping("/earth-image")
    public Mono<String> getEarthImage() {
        return nasaService.getEarthImage(apiKey);
    }

    @GetMapping("/neows")
    public Mono<Map<String, Object>> getNeoWsData(
            @RequestParam("start_date") String startDate,
            @RequestParam("end_date") String endDate) {
        return nasaService.getNeoWsData(startDate, endDate);
    }


    @GetMapping("/iss-location")
    public Mono<String> getIssLocation() {
        return nasaService.getIssLocation();
    }
}
