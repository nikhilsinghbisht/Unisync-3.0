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

    public ReferralRequestResponse createReferral(ReferralRequestDTO requestDTO) {

        User referrer = userRepository.findById(requestDTO.getReferrerId())
                .orElseThrow(() -> new IllegalArgumentException("Referrer user not found"));

        ReferralPost referralPost = ReferralPost.builder()
                .referrer(referrer)
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .company(requestDTO.getCompany())
                .jobLink(requestDTO.getJobLink())
                .notes(requestDTO.getNotes())
                .jobTitle(requestDTO.getJobTitle())
                .build();
        referralPostRepository.save(referralPost);

        return ReferralRequestResponse.builder()
                .message("Referral post created successfully")
                .build();
    }

    public List<ReferralRequestDTO> fetchOpenToApplyReferrals() {
        return referralPostRepository.findByStatus("OPEN")
                .stream()
                .map(post -> ReferralRequestDTO.builder()
                        .postId(post.getId())
                        .referrerId(post.getReferrer().getId())
                        .company(post.getCompany())
                        .jobTitle(post.getJobTitle())
                        .jobLink(post.getJobLink())
                        .notes(post.getNotes())
                        .build())
                .toList();
    }

    public List<ReferralRequestDTO> fetchReferralsAppliedByUser(Long userId) {
        return referralApplicationRepository.findByApplicantIdWithDetails(userId)
                .stream()
                .map(app -> {
                    ReferralPost post = app.getReferralPost();
                    return ReferralRequestDTO.builder()
                            .postId(post.getId())
                            .referrerId(post.getReferrer().getId())
                            .company(post.getCompany())
                            .jobTitle(post.getJobTitle())
                            .jobLink(post.getJobLink())
                            .notes(post.getNotes())
                            .build();
                })
                .toList();
    }

    public List<ReferralRequestDTO> fetchReferralsPostedByUser(Long postedById) {
        return referralPostRepository.findByReferrerIdWithReferrer(postedById)
                .stream()
                .map(post -> ReferralRequestDTO.builder()
                        .postId(post.getId())
                        .referrerId(post.getReferrer().getId())
                        .company(post.getCompany())
                        .jobTitle(post.getJobTitle())
                        .jobLink(post.getJobLink())
                        .notes(post.getNotes())
                        .build())
                .toList();
    }

}
