package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReferralApplicationRepository extends JpaRepository<ReferralApplication, Long> {

    @Query("SELECT ra.applicant,ra.resumeLink FROM ReferralApplication ra JOIN ra.referralPost rp WHERE rp.id = :postedById")
    List<Object[]> findByReferrersByPostId(@Param("postedById") Long postedById);

    @Query("SELECT a FROM ReferralApplication a WHERE a.applicant.id = :applicantId")
    List<ReferralApplication> getApplicationsByApplicant(@Param("applicantId") Long applicantId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ReferralApplication a WHERE a.referralPost.id = :postId")
    void deleteByReferralPostId(@Param("postId") Long postId);

}
