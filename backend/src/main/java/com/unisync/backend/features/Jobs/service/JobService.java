package com.unisync.backend.features.Jobs.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unisync.backend.features.Jobs.dto.JobDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    private final String apiUrl = "https://remotive.com/api/remote-jobs?category=software-dev";

    @Autowired
    private  RestTemplate restTemplate;
    @Autowired
    private  ObjectMapper objectMapper;

    public List<JobDto> fetchJobs() {
        String response = restTemplate.getForObject(apiUrl, String.class);
        List<JobDto> jobList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode jobsNode = root.get("jobs");

            for (JsonNode jobNode : jobsNode) {
                JobDto job = JobDto.builder()
                        .id(jobNode.get("id").asLong())
                        .url(jobNode.get("url").asText())
                        .title(jobNode.get("title").asText())
                        .companyName(jobNode.get("company_name").asText())
                        .companyLogo(jobNode.get("company_logo").asText())
                        .category(jobNode.get("category").asText())
                        .tags(extractTags(jobNode.get("tags")))
                        .jobType(jobNode.get("job_type").asText())
                        .publicationDate(LocalDateTime.parse(jobNode.get("publication_date").asText(), DateTimeFormatter.ISO_DATE_TIME))
                        .candidateRequiredLocation(jobNode.get("candidate_required_location").asText())
                        .salary(jobNode.get("salary").asText())
                        .description(jobNode.get("description").asText())
                        .build();

                jobList.add(job);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return jobList;
    }

    private List<String> extractTags(JsonNode tagsNode) {
        List<String> tags = new ArrayList<>();
        if (tagsNode != null && tagsNode.isArray()) {
            for (JsonNode tag : tagsNode) {
                tags.add(tag.asText());
            }
        }
        return tags;
    }
}
