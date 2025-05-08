package com.linkedin.backend.features.news.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Source {
    private String id;
    private String name;

}