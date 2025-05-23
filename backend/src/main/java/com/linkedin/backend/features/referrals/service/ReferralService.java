package com.linkedin.backend.features.referrals.service;

import com.linkedin.backend.features.authentication.dto.UserDTO;
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
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
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
                .jobLink(requestDTO.getLink())
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

    public List<ReferralRequestDTO> fetchOpenToApplyReferrals(Long userId) {
        return referralPostRepository.findByStatus("OPEN")
                .stream()
                .filter(post -> !post.getReferrer().getId().equals(userId))
                .map(post -> ReferralRequestDTO.builder()
                        .postId(post.getId())
                        .referrerId(post.getReferrer().getId())
                        .company(post.getCompany())
                        .jobTitle(post.getJobTitle())
                        .link(post.getJobLink())
                        .notes(post.getNotes())
                        .build())
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
                        .notes(post.getNotes())
                        .build()
                )
                .toList();
    }

    public ReferralRequestResponse applyReferral(ReferralRequestDTO referralRequestDTO) {
        ReferralPost referralPost = referralPostRepository.findById(referralRequestDTO.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Referral post not found"));

        User referrer = referralPost.getReferrer();

        List<User> applicants = referralRequestDTO.getApplicantId().stream()
                .map(user -> userRepository.findById(user.getId())
                        .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + user.getId())))
                .filter(applicant -> !applicant.getId().equals(referrer.getId()))
                .toList();

        for (User applicant : applicants) {

            boolean alreadyApplied = referralApplicationRepository
                    .existsByApplicantIdAndReferralPostId(applicant.getId(), referralPost.getId());

            if (alreadyApplied) {
                throw new IllegalStateException("User with ID " + applicant.getId() + " has already applied to this referral.");
            }


            ReferralApplication application = ReferralApplication.builder()
                    .referralPost(referralPost)
                    .applicant(applicant)
                    .resumeLink(referralRequestDTO.getLink())
                    .status("PENDING")
                    .appliedAt(LocalDateTime.now())
                    .build();

            referralApplicationRepository.save(application);
            notificationService.sendReferralFilledNotification(applicant, referrer, referralPost.getId());
        }

        return ReferralRequestResponse.builder()
                .message("Referral applications submitted successfully.")
                .build();
    }


    public List<ReferralRequestDTO> appliedReferrals(Long userId) {
        List<ReferralApplication> applications = referralApplicationRepository.getApplicationsByApplicant(userId);
        log.info("Applied referrals fetched for userId: {}", userId);

        return applications.stream()
                .filter(app -> !app.getReferralPost().getReferrer().getId().equals(userId))
                .map(app -> {
                    ReferralPost post = app.getReferralPost();
                    return ReferralRequestDTO.builder()
                            .postId(post.getId())
                            .referrerId(post.getReferrer().getId())
                            .jobTitle(post.getJobTitle())
                            .company(post.getCompany())
                            .link(post.getJobLink())
                            .status(post.getStatus())
                            .createdAt(post.getCreatedAt().toString())
                            .notes(post.getNotes())
                            .applicationStatus(app.getStatus())
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
                        .link(post.getJobLink())
                        .notes(post.getNotes())
                        .status(post.getStatus())
                        .createdAt(post.getCreatedAt().toString())
                        .build())
                .toList();
    }

    @Transactional
    public ReferralRequestResponse deleteReferral(Long userId, Long postId) {
        ReferralPost referralPost = referralPostRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Referral post not found"));

        if (!referralPost.getReferrer().getId().equals(userId)) {
            try {
                throw new AccessDeniedException("You can only delete your own referrals");
            } catch (AccessDeniedException e) {
                e.printStackTrace();
            }
        }

        referralApplicationRepository.deleteByReferralPostId(postId);

        referralPostRepository.deleteById(postId);

        return ReferralRequestResponse.builder()
                .message("Referral deleted successfully.")
                .build();
    }

    public List<UserDTO> getApplicants(Long postId, Long userId) {
        List<Object[]> applicantsData = referralApplicationRepository.findApplicantsByPostAndUser(userId, postId);

        return applicantsData.stream()
                .map(data -> {
                    User user = (User) data[0];
                    String resumeLink = (String) data[1];
                    String status = (String) data[2];

                    return UserDTO.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .company(user.getCompany())
                            .username(user.getUsername())
                            .resumeLink(resumeLink)
                            .applicationStatus(status)
                            .build();
                })
                .toList();
    }
    @Transactional
    public ReferralRequestResponse updateApplicationStatus(Long applicantId, Long postId, String status) {
        // Validate status
        if (!status.equalsIgnoreCase("ACCEPTED") && !status.equalsIgnoreCase("REJECTED")) {
            throw new IllegalArgumentException("Invalid status. Use ACCEPTED or REJECTED.");
        }
        referralApplicationRepository
                .findByApplicantIdAndReferralPostId(applicantId, postId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        // Perform update using custom query
        referralApplicationRepository.updateApplicationStatusByApplicantAndPost(applicantId, postId, status.toUpperCase());

        return ReferralRequestResponse.builder()
                .message("Application status updated to: " + status.toUpperCase())
                .build();
    }


}


