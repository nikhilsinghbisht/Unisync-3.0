package com.linkedin.backend.features.technews.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FullApiResponse {
    private String status;
    private int totalResults;
    private List<Article> articles;

}