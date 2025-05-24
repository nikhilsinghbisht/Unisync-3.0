package com.unisync.backend.features.Jobs.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JobDto {
    private Long id;
    private String url;
    private String title;
    private String companyName;
    private String companyLogo;
    private String category;
    private List<String> tags;
    private String jobType;
    private LocalDateTime publicationDate;
    private String candidateRequiredLocation;
    private String salary;
    private String description;
}
