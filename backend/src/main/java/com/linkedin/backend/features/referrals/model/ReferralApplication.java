package com.linkedin.backend.features.referrals.model;

import com.linkedin.backend.features.authentication.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral_application")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferralApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referral_post_id", nullable = false)
    private ReferralPost referralPost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    private String status = "PENDING";
    private LocalDateTime appliedAt = LocalDateTime.now();
}
