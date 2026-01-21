package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/feed")
    public List<Job> getFeed(java.security.Principal principal) {
        return jobService.getFeed(principal.getName());
    }

    @GetMapping("/user/{userId}")
    public List<Job> getJobsByUser(@PathVariable Long userId) {
        return jobService.getJobsByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Only Admin can access these (Configured in SecurityConfig)
    @PostMapping
    public Job createJob(@RequestBody Job job, java.security.Principal principal) {
        return jobService.createJob(job, principal.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
}
