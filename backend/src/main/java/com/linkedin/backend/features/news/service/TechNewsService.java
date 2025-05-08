package com.linkedin.backend.features.news.service;

import com.linkedin.backend.features.news.dto.FullApiResponse;
import com.linkedin.backend.features.news.model.TechNewsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TechNewsService {

    @Value("${newsapi.key}")
    private String apiKey = "dd43f5c6ef9d4bd58b28fbf48d0949a4";

    public TechNewsResponse fetchTechNews() {
        String url = "https://newsapi.org/v2/top-headlines?category=technology&pageSize=5&language=en&apiKey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        FullApiResponse fullResponse = restTemplate.getForObject(url, FullApiResponse.class);

        TechNewsResponse response =  TechNewsResponse.builder()
                .articles(fullResponse.getArticles())
                .totalResults(fullResponse.getTotalResults())
                .status("OK")
                .build();
        return response;
    }
}
