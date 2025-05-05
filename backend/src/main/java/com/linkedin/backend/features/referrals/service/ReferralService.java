package com.linkedin.backend.features.referrals.service;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.authentication.repository.UserRepository;
import com.linkedin.backend.features.referrals.dto.ReferralRequestDTO;
import com.linkedin.backend.features.referrals.dto.ReferralRequestResponse;
import com.linkedin.backend.features.referrals.model.ReferralPost;
import com.linkedin.backend.features.referrals.repository.ReferralApplicationRepository;
import com.linkedin.backend.features.referrals.repository.ReferralPostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReferralService {

    private final ReferralPostRepository referralPostRepository;
    private final ReferralApplicationRepository referralApplicationRepository;
    private final UserRepository userRepository;

    public ReferralService(ReferralPostRepository referralPostRepository,
                           ReferralApplicationRepository referralApplicationRepository,
                           UserRepository userRepository) {
        this.referralPostRepository = referralPostRepository;
        this.referralApplicationRepository = referralApplicationRepository;
        this.userRepository = userRepository;
    }

    // 🔹 Create a referral post
    public ReferralRequestResponse createReferral(ReferralRequestDTO requestDTO) {

        User referrer = userRepository.findById(requestDTO.getReferrerId())
                .orElseThrow(() -> new IllegalArgumentException("Referrer user not found"));

        ReferralPost referralPost = new ReferralPost();
        referralPost.setReferrer(referrer);
        referralPost.setCompany(requestDTO.getCompany());
        referralPost.setJobTitle(requestDTO.getJobTitle());
        referralPost.setJobLink(requestDTO.getJobLink());
        referralPost.setNotes(requestDTO.getNotes());
        referralPost.setCreatedAt(LocalDateTime.now());
        referralPost.setUpdatedAt(LocalDateTime.now());
        referralPost.setStatus("OPEN");

        referralPostRepository.save(referralPost);

        return ReferralRequestResponse.builder()
                .message("Referral post created successfully")
                .build();
    }

    // 🔹 Fetch all active referral posts
    public List<ReferralRequestDTO> fetchReferrals() {
        return referralPostRepository.findByStatus("OPEN")
                .stream()
                .map(post -> ReferralRequestDTO.builder()
                        .referrerId(post.getReferrer().getId())
                        .company(post.getCompany())
                        .jobTitle(post.getJobTitle())
                        .jobLink(post.getJobLink())
                        .notes(post.getNotes())
                        .build())
                .collect(Collectors.toList());
    }

    // 🔹 Fetch all posts applied by a specific user
    public List<ReferralRequestDTO> fetchReferralsAppliedByUser(Long applicantId) {
        return referralApplicationRepository.findByApplicantId(applicantId)
                .stream()
                .map(app -> {
                    ReferralPost post = app.getReferralPost();
                    return ReferralRequestDTO.builder()
                            .referrerId(post.getReferrer().getId())
                            .company(post.getCompany())
                            .jobTitle(post.getJobTitle())
                            .jobLink(post.getJobLink())
                            .notes(post.getNotes())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
