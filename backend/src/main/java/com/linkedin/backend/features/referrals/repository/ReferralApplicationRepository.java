package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralApplication;
import com.linkedin.backend.features.referrals.model.ReferralPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralApplicationRepository extends JpaRepository<ReferralApplication, Long> {

    @Query("SELECT ra FROM ReferralApplication ra " +
            "JOIN FETCH ra.referralPost rp " +
            "JOIN FETCH rp.referrer " +
            "WHERE ra.applicant.id = :applicantId")
    List<ReferralApplication> findByApplicantIdWithDetails(@Param("applicantId") Long applicantId);


}
