package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.dto.AdminStatsResponse;
import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.ApplicationRepository;
import in.thiruvikram.applytogether.repository.JobRepository;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusWeeks(1);
        LocalDateTime oneMonthAgo = now.minusMonths(1);

        long newUsersThisWeek = userRepository.countByCreatedAtAfter(oneWeekAgo);
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(oneMonthAgo);

        List<String> activeBatches = userRepository.findMostActiveBatch();
        String mostActiveBatch = activeBatches.isEmpty() ? "N/A" : activeBatches.get(0);

        // Calculate User Growth (Last 7 Days)
        List<Map<String, Object>> userGrowth = new ArrayList<>();
        List<User> allUsers = userRepository.findAll();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = now.minusDays(i);
            String dateLabel = date.toLocalDate().toString();
            long count = allUsers.stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().isEqual(date.toLocalDate()))
                    .count();

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", dateLabel);
            dataPoint.put("count", count);
            userGrowth.add(dataPoint);
        }

        // Calculate Batch Distribution
        Map<String, Long> distribution = allUsers.stream()
                .filter(u -> u.getPassingYear() != null)
                .collect(Collectors.groupingBy(User::getPassingYear, Collectors.counting()));

        List<Map<String, Object>> batchDistribution = distribution.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("batch", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        return new AdminStatsResponse(
                totalUsers,
                totalJobs,
                totalApplications,
                newUsersThisWeek,
                newUsersThisMonth,
                mostActiveBatch,
                userGrowth,
                batchDistribution);
    }

    public List<User> getAllUsers(String role, String batchYear) {
        if (role != null && batchYear != null) {
            return userRepository.findByRoleAndPassingYear(role, batchYear);
        } else if (role != null) {
            return userRepository.findByRole(role);
        } else if (batchYear != null) {
            return userRepository.findByPassingYear(batchYear);
        } else {
            return userRepository.findAll();
        }
    }

    @Transactional
    public User updateUser(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("fullName")) {
            user.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("passingYear")) {
            user.setPassingYear((String) updates.get("passingYear"));
        }
        if (updates.containsKey("role")) {
            user.setRole((String) updates.get("role"));
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public List<Job> getAllJobs(String batchYear, String jobType) {
        if (batchYear != null && jobType != null) {
            return jobRepository.findByBatchYearContainingAndJobType(batchYear, jobType);
        } else if (batchYear != null) {
            return jobRepository.findByBatchYearContaining(batchYear);
        } else if (jobType != null) {
            return jobRepository.findByJobType(jobType);
        } else {
            return jobRepository.findAll();
        }
    }

    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new RuntimeException("Job not found");
        }
        jobRepository.deleteById(jobId);
    }

    public List<Map<String, Object>> getRecentActivity(int limit) {
        // This is a simplified version. In a real app, you might have a dedicated
        // Activity table.
        // For now, we'll combine recent users and jobs.

        List<Map<String, Object>> activities = new ArrayList<>();

        // Recent Users
        List<User> recentUsers = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null)
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        for (User user : recentUsers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "USER_REGISTERED");
            activity.put("description", "New user registered: " + user.getUsername());
            activity.put("timestamp", user.getCreatedAt());
            activity.put("user", user.getUsername());
            activities.add(activity);
        }

        // Recent Jobs
        List<Job> recentJobs = jobRepository.findAll().stream()
                .filter(job -> job.getPostedDate() != null)
                .sorted(Comparator.comparing(Job::getPostedDate).reversed())
                .limit(limit)
                .collect(Collectors.toList());

        for (Job job : recentJobs) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "JOB_POSTED");
            activity.put("description", "New job posted: " + job.getTitle() + " at " + job.getCompany());
            activity.put("timestamp", job.getPostedDate());
            if (job.getPostedBy() != null) {
                activity.put("user", job.getPostedBy().getUsername());
            }
            activities.add(activity);
        }

        // Sort all activities by timestamp
        return activities.stream()
                .filter(a -> a.get("timestamp") != null)
                .sorted((a, b) -> ((LocalDateTime) b.get("timestamp")).compareTo((LocalDateTime) a.get("timestamp")))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
