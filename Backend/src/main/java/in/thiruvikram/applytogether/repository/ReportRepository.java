package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Report;
import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findBySubmittedBy(User user);

    List<Report> findByAssignedTo(User staff);

    List<Report> findByStatus(String status);

    List<Report> findAllByOrderByCreatedAtDesc();
}
