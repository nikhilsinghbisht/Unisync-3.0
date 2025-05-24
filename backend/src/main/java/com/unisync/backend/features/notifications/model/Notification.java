package com.unisync.backend.features.notifications.model;

import com.unisync.backend.features.authentication.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@Entity
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User recipient;

    @ManyToOne
    private User actor;

    private boolean isRead;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private Long resourceId;

    @CreationTimestamp
    private LocalDateTime creationDate;

}
