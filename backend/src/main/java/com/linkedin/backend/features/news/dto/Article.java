package com.linkedin.backend.features.news.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Article {
    private Source source;
    private String author;
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private String publishedAt;
    private String content;

    // Getters and Setters
    // (Omitted here for brevity, but include all fields)
}