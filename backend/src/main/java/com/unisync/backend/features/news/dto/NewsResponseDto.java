package com.unisync.backend.features.news.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NewsResponseDto {
    private int totalResults;
    private List<Article> articles;

}
