package com.unisync.backend.features.referrals.model;

import com.unisync.backend.features.authentication.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral_post")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "referrer")
public class ReferralPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
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
