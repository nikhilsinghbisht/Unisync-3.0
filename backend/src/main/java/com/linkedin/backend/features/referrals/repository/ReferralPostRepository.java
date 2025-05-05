package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralPostRepository extends JpaRepository<ReferralPost, Long> {

    // Fetch all referral posts with status "OPEN"
    List<ReferralPost> findByStatus(String status);

    // Optional: Fetch posts by referrer ID
    List<ReferralPost> findByReferrerId(Long referrerId);
}
