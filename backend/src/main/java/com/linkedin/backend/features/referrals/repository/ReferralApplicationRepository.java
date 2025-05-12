package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    @Query("SELECT ra.applicant, ra.resumeLink, ra.status FROM ReferralApplication ra WHERE ra.referralPost.id = :postId AND ra.referralPost.referrer.id = :userId")
    List<Object[]> findApplicantsByPostAndUser(@Param("userId") Long userId, @Param("postId") Long postId);


    @Modifying
    @Transactional
    @Query("UPDATE ReferralApplication ra SET ra.status = :status WHERE ra.applicant.id = :applicantId AND ra.referralPost.id = :postId")
    void updateApplicationStatusByApplicantAndPost(@Param("applicantId") Long applicantId,
                                                   @Param("postId") Long postId,
                                                   @Param("status") String status);



    Optional<ReferralApplication> findByApplicantIdAndReferralPostId(Long applicantId, Long postId);
    boolean existsByApplicantIdAndReferralPostId(Long applicantId, Long postId);






}
