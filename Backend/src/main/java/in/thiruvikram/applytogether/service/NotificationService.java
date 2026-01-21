package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Notification;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.NotificationRepository;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getUserNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to modify this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteAllNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.deleteByRecipientId(user.getId());
    }
}
