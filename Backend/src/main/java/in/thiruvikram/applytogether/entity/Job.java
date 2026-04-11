package in.thiruvikram.applytogether.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Company name is required")
    @Column(nullable = false)
    private String company;

    @NotBlank(message = "Job URL is required")
    @Size(max = 500, message = "URL is too long")
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
}
