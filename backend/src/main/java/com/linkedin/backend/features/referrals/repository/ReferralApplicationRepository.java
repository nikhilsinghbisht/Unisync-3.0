package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralApplicationRepository extends JpaRepository<ReferralApplication, Long> {

    // Fetch all applications by a given applicant
    List<ReferralApplication> findByApplicantId(Long applicantId);

    // Optional: Fetch applications by referral post
    List<ReferralApplication> findByReferralPostId(Long referralPostId);
}
