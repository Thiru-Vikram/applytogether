package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public Page<Job> getAllJobs(
            @PageableDefault(size = 10, sort = "postedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return jobService.getAllJobs(pageable);
    }

    @GetMapping("/feed")
    public Page<Job> getFeed(
            java.security.Principal principal,
            @PageableDefault(size = 10, sort = "postedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return jobService.getFeed(principal.getName(), pageable);
    }

    @GetMapping("/user/{userId}")
    public Page<Job> getJobsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "postedDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return jobService.getJobsByUser(userId, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Only Admin can access these (Configured in SecurityConfig)
    @PostMapping
    public Job createJob(@Valid @RequestBody Job job, java.security.Principal principal) {
        return jobService.createJob(job, principal.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody Job jobDetails) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
}
