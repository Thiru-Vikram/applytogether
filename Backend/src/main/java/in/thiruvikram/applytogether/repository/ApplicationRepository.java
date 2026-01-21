package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUser(User user);
    Optional<Application> findByUserAndJobId(User user, Long jobId);
}
