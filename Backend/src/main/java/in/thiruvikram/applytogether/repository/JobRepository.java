package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Custom finder to sort by posted date descending (newest first)
    List<Job> findAllByOrderByPostedDateDesc();

    // Optional: Finder by company name
    List<Job> findByCompanyContainingIgnoreCase(String company);

    // Optional: Finder by job type
    List<Job> findByJobType(String jobType);

    // Find jobs posted by a list of users with pagination
    Page<Job> findByPostedByInOrderByPostedDateDesc(List<User> users, Pageable pageable);

    // Find jobs posted by a specific user with pagination
    Page<Job> findByPostedByOrderByPostedDateDesc(User user, Pageable pageable);

    // Admin queries
    List<Job> findByBatchYearContaining(String batchYear);

    List<Job> findByBatchYearContainingAndJobType(String batchYear, String jobType);
}
