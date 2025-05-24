package com.unisync.backend.features.news.controller;

import com.unisync.backend.features.news.model.TechNewsResponse;
import com.unisync.backend.features.news.service.TechNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news-letter")
public class TechNewsController {

    @Autowired
    private TechNewsService techNewsService;

    @GetMapping("/news")
    public ResponseEntity<TechNewsResponse> getLatestTechNews() {
        TechNewsResponse news = techNewsService.fetchTechNews();
        return ResponseEntity.ok(news);
    }
}
