package com.linkedin.backend.features.referrals.service;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.authentication.repository.UserRepository;
import com.linkedin.backend.features.notifications.service.NotificationService;
import com.linkedin.backend.features.referrals.dto.ReferralRequestDTO;
import com.linkedin.backend.features.referrals.dto.ReferralRequestResponse;
import com.linkedin.backend.features.referrals.model.ReferralApplication;
import com.linkedin.backend.features.referrals.model.ReferralPost;
import com.linkedin.backend.features.referrals.repository.ReferralApplicationRepository;
import com.linkedin.backend.features.referrals.repository.ReferralPostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class ReferralService {

    private final ReferralPostRepository referralPostRepository;
    private final ReferralApplicationRepository referralApplicationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReferralService(ReferralPostRepository referralPostRepository,
                           ReferralApplicationRepository referralApplicationRepository,
                           UserRepository userRepository, NotificationService notificationService) {
        this.referralPostRepository = referralPostRepository;
        this.referralApplicationRepository = referralApplicationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
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

        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            if (!user.getId().equals(referrer.getId())) {
                notificationService.sendReferralAvailableNotification(referrer, user, referralPost.getId());
            }
        }

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
                        .applicantId(
                                referralApplicationRepository.findByReferrersByPostId(post.getId())
                        )
                        .build())
                .toList();
    }


    public ReferralRequestResponse applyReferral(ReferralRequestDTO referralRequestDTO) {
        ReferralPost referralPost = referralPostRepository.findById(referralRequestDTO.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Referral post not found"));
        List<User> applicants = referralRequestDTO.getApplicantId().stream()
                .map(user -> userRepository.findById(user.getId())
                        .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + user.getId()))).toList();
        applicants.stream()
                .map(applicant -> ReferralApplication.builder()
                        .referralPost(referralPost)
                        .applicant(applicant)
                        .status("PENDING")
                        .appliedAt(LocalDateTime.now())
                        .build())
                .map(referralApplicationRepository::save)
                .toList();
        User referrer = referralPost.getReferrer();
        for (User applicant : applicants) {
            if (!referrer.getId().equals(applicant.getId())) {
                notificationService.sendReferralFilledNotification(applicant, referrer, referralPost.getId());
            }
        }
        return ReferralRequestResponse.builder()
                .message("Referral applications submitted successfully.")
                .build();
    }

    public List<ReferralRequestDTO> appliedReferrals(Long userId) {
        List<ReferralApplication> applications = referralApplicationRepository.getApplicationsByApplicant(userId);
        log.info("Applied referrals fetched for userId: {}", userId);
        return applications.stream()
                .map(app -> {
                    ReferralPost post = app.getReferralPost();
                    return ReferralRequestDTO.builder()
                            .postId(post.getId())
                            .referrerId(post.getReferrer().getId())
                            .jobTitle(post.getJobTitle())
                            .company(post.getCompany())
                            .jobLink(post.getJobLink())
                            .status(post.getStatus())
                            .createdAt(post.getCreatedAt().toString())
                            .notes(post.getNotes())
                            .build();
                })
                .toList();
    }

    public List<ReferralRequestDTO> createdReferrals(Long userId) {
        List<ReferralPost> posts = referralPostRepository.getPostsByReferrer(userId);
        log.info("Created referrals fetched for userId: {}", userId);
        return posts.stream()
                .map(post -> ReferralRequestDTO.builder()
                        .postId(post.getId())
                        .referrerId(post.getReferrer().getId())
                        .jobTitle(post.getJobTitle())
                        .company(post.getCompany())
                        .jobLink(post.getJobLink())
                        .notes(post.getNotes())
                        .status(post.getStatus())
                        .createdAt(post.getCreatedAt().toString())
                        .build())
                .toList();
    }

    public ReferralRequestResponse deleteReferral(Long userId, Long postId) {
        ReferralPost referralPost = referralPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Referral post not found"));

        if (!referralPost.getReferrer().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to delete this referral post");
        }

        referralPostRepository.delete(referralPost);
        log.info("Referral post with ID {} deleted successfully", postId);
        return ReferralRequestResponse.builder()
                .message("Referral post deleted successfully")
                .build();
    }
}


