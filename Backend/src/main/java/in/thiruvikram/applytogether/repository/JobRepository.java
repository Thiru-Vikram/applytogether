package in.thiruvikram.applytogether.repository;

import in.thiruvikram.applytogether.entity.Job;
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

    // Find jobs posted by a list of users
    List<Job> findByPostedByInOrderByPostedDateDesc(List<in.thiruvikram.applytogether.entity.User> users);

    // Admin queries
    List<Job> findByBatchYearContaining(String batchYear);

    List<Job> findByBatchYearContainingAndJobType(String batchYear, String jobType);
}
