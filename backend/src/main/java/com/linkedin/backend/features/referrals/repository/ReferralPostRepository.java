package com.linkedin.backend.features.referrals.repository;

import com.linkedin.backend.features.referrals.model.ReferralPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralPostRepository extends JpaRepository<ReferralPost, Long> {

    List<ReferralPost> findByStatus(String status);

    @Query("SELECT rp FROM ReferralPost rp JOIN FETCH rp.referrer WHERE rp.referrer.id = :referrerId")
    List<ReferralPost> findByReferrerIdWithReferrer(@Param("referrerId") Long referrerId);

    @Query("SELECT r FROM ReferralPost r WHERE r.id = :id")
    List<ReferralPost> getPostsByReferrer(@Param("id") Long id);
}
