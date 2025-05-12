package com.linkedin.backend.features.referrals.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.linkedin.backend.features.authentication.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReferralRequestDTO {
    private Long postId;
    private Long referrerId;
    private String jobTitle;
    private String company;
    private String link;
    private String notes;
    private String status;
    private String createdAt;
    private String applicationStatus;


    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<UserDTO> applicantId;
}
