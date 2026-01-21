package in.thiruvikram.applytogether.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false, length = 500)
    private String jobUrl;

    @ManyToOne
    @JoinColumn(name = "posted_by_user_id")
    private User postedBy;

    private String jobType;

    private String batchYear; // Eligibility year, e.g., "2025, 2026"

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime postedDate;

    public Job() {
    }

    public Job(Long id, String title, String company, String jobUrl, String jobType, String batchYear,
            LocalDateTime postedDate) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.jobUrl = jobUrl;
        this.jobType = jobType;
        this.batchYear = batchYear;
        this.postedDate = postedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getBatchYear() {
        return batchYear;
    }

    public void setBatchYear(String batchYear) {
        this.batchYear = batchYear;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }
}
