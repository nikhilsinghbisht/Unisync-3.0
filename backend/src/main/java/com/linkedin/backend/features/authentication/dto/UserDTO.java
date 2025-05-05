package com.linkedin.backend.features.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private Boolean emailVerified;
    private String firstName;
    private String lastName;
    private String company;
    private String position;
    private String location;
    private String profilePicture;
    private String coverPicture;
    private Boolean profileComplete;
    private String about;
}