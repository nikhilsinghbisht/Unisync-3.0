package com.linkedin.backend.features.referrals.dto;

import com.linkedin.backend.features.authentication.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReferralRequestDTO {

    private Long referrerId;
    private String jobTitle;
    private String company;
    private String jobLink;
    private String notes;
    private List<User> applicantId;
}
