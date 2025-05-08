package com.linkedin.backend.features.referrals.model;

import com.linkedin.backend.features.authentication.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral_post")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReferralPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id", nullable = false)
    private User referrer;

    private String company;
    private String jobTitle;
    private String jobLink;
    private String notes;

    @Builder.Default
    private String status = "OPEN";
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
