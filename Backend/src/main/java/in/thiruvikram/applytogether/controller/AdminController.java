package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.dto.AdminStatsResponse;
import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get admin dashboard statistics
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        AdminStatsResponse stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    // Get all users (for user management)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String batchYear) {
        List<User> users = adminService.getAllUsers(role, batchYear);
        return ResponseEntity.ok(users);
    }

    // Edit user details
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> updates) {
        User updatedUser = adminService.updateUser(userId, updates);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // Get all jobs (for job moderation)
    @GetMapping("/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) String batchYear,
            @RequestParam(required = false) String jobType) {
        return ResponseEntity.ok(adminService.getAllJobs(batchYear, jobType));
    }

    // Delete job
    @DeleteMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long jobId) {
        adminService.deleteJob(jobId);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    // Get recent activity
    @GetMapping("/activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(adminService.getRecentActivity(limit));
    }
}
