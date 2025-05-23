package com.linkedin.backend.features.referrals.controller;

import com.linkedin.backend.features.authentication.dto.UserDTO;
import com.linkedin.backend.features.referrals.dto.ReferralRequestDTO;
import com.linkedin.backend.features.referrals.dto.ReferralRequestResponse;
import com.linkedin.backend.features.referrals.service.ReferralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/referrals")
public class ReferralController {

    private final ReferralService referralService;
    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @PostMapping("/add")
    public ResponseEntity<ReferralRequestResponse> createReferral(@RequestBody ReferralRequestDTO referralRequestDTO) {
        return ResponseEntity.ok(referralService.createReferral(referralRequestDTO));
    }

    @GetMapping("/my-posted/{userId}")
    public ResponseEntity<List<ReferralRequestDTO>> fetchReferralsPostedByUser(@PathVariable Long userId) {
        List<ReferralRequestDTO> referrals = referralService.fetchReferralsPostedByUser(userId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/open-to-apply")
    public List<ReferralRequestDTO> getOpenToApplyReferrals(@RequestParam Long userId) {
        return referralService.fetchOpenToApplyReferrals(userId);
    }

    @PostMapping("/apply")
    public ResponseEntity<ReferralRequestResponse> applyReferral(@RequestBody ReferralRequestDTO referralRequestDTO) {
        ReferralRequestResponse referrals = referralService.applyReferral(referralRequestDTO);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/applied")
    public ResponseEntity<List<ReferralRequestDTO>> appliedReferrals(@RequestParam("userId")Long userId){
        List<ReferralRequestDTO> referrals = referralService.appliedReferrals(userId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/created")
    public ResponseEntity<List<ReferralRequestDTO>> createdReferrals(@RequestParam("userId")Long userId){
        List<ReferralRequestDTO> referrals = referralService.createdReferrals(userId);
        return ResponseEntity.ok(referrals);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ReferralRequestResponse> deleteReferral(@RequestParam("userId")Long userId,
                                                 @RequestParam("postId")Long postId){
        ReferralRequestResponse referrals = referralService.deleteReferral(userId,postId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/applicants")
    public ResponseEntity<List<UserDTO>> getApplicants(@RequestParam("postId")Long postId,
                                                 @RequestParam("userId")Long userId){
        List<UserDTO> referrals = referralService.getApplicants(postId,userId);
        return ResponseEntity.ok(referrals);
    }
    
    @PutMapping("/referral/application/status")
    public ResponseEntity<?> updateApplicationStatus(@RequestParam Long applicantId,
                                                     @RequestParam Long postId,
                                                     @RequestParam String status) {
        ReferralRequestResponse response = referralService.updateApplicationStatus(applicantId, postId, status);
        return ResponseEntity.ok(response);
    }


}
