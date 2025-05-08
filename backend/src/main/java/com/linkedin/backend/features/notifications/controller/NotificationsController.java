package com.linkedin.backend.features.notifications.controller;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.notifications.model.Notification;
import com.linkedin.backend.features.notifications.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationsController {
    private final NotificationService notificationService;

    public NotificationsController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getUserNotifications(@RequestAttribute("authenticatedUser") User user) {
        return notificationService.getUserNotifications(user);
    }

    @PutMapping("/{notificationId}")
    public Notification markNotificationAsRead(@PathVariable Long notificationId) {
        return notificationService.markNotificationAsRead(notificationId);
    }

    @PostMapping("/referral-available")
    public void sendReferralAvailableNotification(
            @RequestAttribute("authenticatedUser") User actor,
            @RequestParam Long recipientId,
            @RequestParam Long referralId) {
        User recipient = new User();
        recipient.setId(recipientId);
        notificationService.sendReferralAvailableNotification(actor, recipient, referralId);
    }

    @PostMapping("/referral-filled")
    public void sendReferralFilledNotification(
            @RequestAttribute("authenticatedUser") User actor,
            @RequestParam Long recipientId,
            @RequestParam Long referralId) {
        User recipient = new User();
        recipient.setId(recipientId);
        notificationService.sendReferralFilledNotification(actor, recipient, referralId);
    }
}
