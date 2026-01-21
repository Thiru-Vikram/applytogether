package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.Notification;
import in.thiruvikram.applytogether.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Principal principal) {
        return ResponseEntity.ok(notificationService.getUserNotifications(principal.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id, java.security.Principal principal) {
        notificationService.markAsRead(id, principal.getName());
        return ResponseEntity.ok("Notification marked as read");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id, java.security.Principal principal) {
        notificationService.deleteNotification(id, principal.getName());
        return ResponseEntity.ok("Notification deleted");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAllNotifications(Principal principal) {
        notificationService.deleteAllNotifications(principal.getName());
        return ResponseEntity.ok("All notifications cleared");
    }
}
