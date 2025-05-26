package com.linkedin.backend.features.feed.controller;

import com.linkedin.backend.features.feed.dto.ReportRequestDTO;
import com.linkedin.backend.features.feed.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/this")
    public ResponseEntity<String> reportContent(@RequestBody ReportRequestDTO requestDTO) {
        try {
            String message = reportService.reportContent(requestDTO);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
