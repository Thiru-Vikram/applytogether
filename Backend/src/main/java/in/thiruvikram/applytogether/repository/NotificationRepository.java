package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    void deleteByRecipientId(Long recipientId);
}
