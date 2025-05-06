package com.linkedin.backend.features.referrals.controller;

import com.linkedin.backend.features.referrals.dto.ReferralRequestDTO;
import com.linkedin.backend.features.referrals.dto.ReferralRequestResponse;
import com.linkedin.backend.features.referrals.service.ReferralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/referrals")
public class ReferralController {

    @Autowired
    private ReferralService referralService;

    @PostMapping("/add")
    public ResponseEntity<ReferralRequestResponse> createReferral(@RequestBody ReferralRequestDTO referralRequestDTO) {
        return ResponseEntity.ok(referralService.createReferral(referralRequestDTO));
    }

    @GetMapping("/my-posted/{userId}")
    public ResponseEntity<List<ReferralRequestDTO>> fetchReferralsPostedByUser(@PathVariable Long userId) {
        List<ReferralRequestDTO> referrals = referralService.fetchReferralsPostedByUser(userId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/my-applied/{userId}")
    public ResponseEntity<List<ReferralRequestDTO>> fetchReferralsAppliedByUser(@PathVariable Long userId) {
        List<ReferralRequestDTO> referrals = referralService.fetchReferralsAppliedByUser(userId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/open-to-apply")
    public ResponseEntity<List<ReferralRequestDTO>> fetchOpenToApplyReferrals() {
        List<ReferralRequestDTO> referrals = referralService.fetchOpenToApplyReferrals();
        return ResponseEntity.ok(referrals);
    }

}
