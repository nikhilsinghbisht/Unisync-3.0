package com.linkedin.backend.features.authentication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.linkedin.backend.features.feed.model.Post;
import com.linkedin.backend.features.messaging.model.Conversation;
import com.linkedin.backend.features.networking.model.Connection;
import com.linkedin.backend.features.notifications.model.Notification;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import java.time.LocalDateTime;
import java.util.List;
@Entity(name = "users")
@Indexed(index = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @Builder.Default
    private Boolean emailVerified = true;

    @Builder.Default
    private String emailVerificationToken = null;

    @Builder.Default
    private LocalDateTime emailVerificationTokenExpiryDate = null;

    @JsonIgnore
    private String password;

    @Builder.Default
    private String passwordResetToken = null;

    @Builder.Default
    private LocalDateTime passwordResetTokenExpiryDate = null;

    @FullTextField(analyzer = "standard")
    @Builder.Default
    private String firstName = null;

    @FullTextField(analyzer = "standard")
    @Builder.Default
    private String lastName = null;

    @FullTextField(analyzer = "standard")
    @Builder.Default
    private String company = null;

    @FullTextField(analyzer = "standard")
    @Builder.Default
    private String position = null;

    @Builder.Default
    private String location = null;

    @Builder.Default
    private String profilePicture = null;

    @Builder.Default
    private String coverPicture = null;

    @Builder.Default
    private Boolean profileComplete = false;

    @Builder.Default
    private String about = null;

    @JsonIgnore
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> receivedNotifications;

    @JsonIgnore
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> actedNotifications;

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Conversation> conversationsAsAuthor;

    @JsonIgnore
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Conversation> conversationsAsRecipient;

    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Connection> initiatedConnections;

    @JsonIgnore
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Connection> receivedConnections;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public void updateProfileCompletionStatus() {
        this.profileComplete = (this.firstName != null && this.lastName != null &&
                this.company != null && this.position != null &&
                this.location != null);
    }
}
