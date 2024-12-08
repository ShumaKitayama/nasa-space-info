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

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
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
            @RequestParam("start_date") String startDateStr,
            @RequestParam("end_date") String endDateStr) {
        // 追加バリデーション: 日付が正しい形式かつ将来日付ではないこと
        LocalDate startDate;
        LocalDate endDate;
        try {
            startDate = LocalDate.parse(startDateStr);
            endDate = LocalDate.parse(endDateStr);
        } catch (DateTimeParseException e) {
            logger.error("Invalid date format: start_date={}, end_date={}", startDateStr, endDateStr);
            return Mono.error(new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD."));
        }

        if (startDate.isAfter(endDate)) {
            logger.error("Start date is after end date: start_date={}, end_date={}", startDateStr, endDateStr);
            return Mono.error(new IllegalArgumentException("Start date must be before or equal to end date."));
        }

        LocalDate now = LocalDate.now();
        if (startDate.isAfter(now) || endDate.isAfter(now)) {
            logger.error("Date range includes future dates not supported by NEO API: start_date={}, end_date={}", startDateStr, endDateStr);
            return Mono.error(new IllegalArgumentException("Date range cannot include future dates."));
        }

        return nasaService.getNeoWsData(startDateStr, endDateStr);
    }

    @GetMapping("/iss-location")
    public Mono<String> getIssLocation() {
        return nasaService.getIssLocation();
    }
}
