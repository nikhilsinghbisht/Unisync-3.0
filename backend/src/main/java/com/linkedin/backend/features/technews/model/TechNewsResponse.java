package com.linkedin.backend.features.technews.model;

import com.linkedin.backend.features.technews.dto.Article;
import lombok.Builder;
import lombok.Data;

import java.util.List;


@Data
@Builder
public class TechNewsResponse {
    private String status;
    private int totalResults;
    private List<Article> articles;

    // Getters and Setters
}
