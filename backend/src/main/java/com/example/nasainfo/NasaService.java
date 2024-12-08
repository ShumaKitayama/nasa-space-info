package com.example.nasainfo;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.*;

@Service
public class NasaService {

    private static final Logger logger = LoggerFactory.getLogger(NasaService.class);

    private final WebClient webClient;

    @Value("${nasa.api.key}")
    private String apiKey;

    public NasaService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.nasa.gov").build();
    }

    public Mono<String> getAstronomyPicture(String apiKey) {
        logger.info("Fetching Astronomy Picture of the Day...");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/planetary/apod")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getMarsRoverPhotos(String apiKey) {
        logger.info("Fetching Mars Rover Photos...");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/mars-photos/api/v1/rovers/curiosity/photos")
                        .queryParam("sol", "1000")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getEarthImage(String apiKey) {
        logger.info("Fetching Earth Images...");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/EPIC/api/natural/images")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<Map<String, Object>> getNeoWsData(String startDate, String endDate) {
        logger.info("Fetching NeoWs data for start_date={} and end_date={}", startDate, endDate);

        // 日付フォーマットの再確認(正規表現はコントローラ側で済んでいるが一応残す)
        if (!startDate.matches("\\d{4}-\\d{2}-\\d{2}") || !endDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
            logger.error("Invalid date format: start_date={}, end_date={}", startDate, endDate);
            return Mono.error(new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD."));
        }

        if (startDate.compareTo(endDate) > 0) {
            logger.error("Start date is after end date: start_date={}, end_date={}", startDate, endDate);
            return Mono.error(new IllegalArgumentException("Start date must be before or equal to end date."));
        }

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/neo/rest/v1/feed")
                        .queryParam("start_date", startDate)
                        .queryParam("end_date", endDate)
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(response -> {
                    // エラーチェック: `near_earth_objects`が無ければNASA側エラーとみなす
                    if (!response.has("near_earth_objects")) {
                        logger.error("Invalid API response (no near_earth_objects): {}", response.toPrettyString());
                        return Mono.error(new IllegalArgumentException("API returned invalid response or error. Check logs."));
                    }
                    return Mono.just(processNeoData(response));
                })
                .doOnError(error -> logger.error("Error fetching NeoWs data: {}", error.getMessage()));
    }

    private Map<String, Object> processNeoData(JsonNode data) {
        logger.info("Processing NEO WS data...");

        Map<String, Object> result = new HashMap<>();
        Map<String, Integer> sizeCategories = new HashMap<>();
        Map<String, Integer> speedCategories = new HashMap<>();

        // `near_earth_objects`を巡回
        data.get("near_earth_objects").fields().forEachRemaining(entry -> {
            entry.getValue().forEach(neo -> {
                double minDiameter = neo.get("estimated_diameter").get("kilometers").get("estimated_diameter_min").asDouble();
                double speed = neo.get("close_approach_data").get(0).get("relative_velocity").get("kilometers_per_hour").asDouble();

                // サイズ分類
                if (minDiameter < 0.5) {
                    sizeCategories.merge("Small (<0.5km)", 1, Integer::sum);
                } else if (minDiameter < 1) {
                    sizeCategories.merge("Medium (0.5-1km)", 1, Integer::sum);
                } else {
                    sizeCategories.merge("Large (>1km)", 1, Integer::sum);
                }

                // 速度分類
                if (speed < 10000) {
                    speedCategories.merge("Slow (<10k km/h)", 1, Integer::sum);
                } else if (speed < 30000) {
                    speedCategories.merge("Moderate (10k-30k km/h)", 1, Integer::sum);
                } else {
                    speedCategories.merge("Fast (>30k km/h)", 1, Integer::sum);
                }
            });
        });

        result.put("sizes", Map.of(
                "labels", sizeCategories.keySet(),
                "values", sizeCategories.values()
        ));
        result.put("speeds", Map.of(
                "labels", speedCategories.keySet(),
                "values", speedCategories.values()
        ));

        return result;
    }



    public Mono<String> getIssLocation() {
        logger.info("Fetching ISS location...");
        return WebClient.create("http://api.open-notify.org")
                .get()
                .uri("/iss-now.json")
                .retrieve()
                .bodyToMono(String.class);
    }
}
