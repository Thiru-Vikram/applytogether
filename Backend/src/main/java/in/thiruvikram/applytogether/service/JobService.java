package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Follow;
import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.Notification;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.FollowRepository;
import in.thiruvikram.applytogether.repository.JobRepository;
import in.thiruvikram.applytogether.repository.NotificationRepository;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Page<Job> getAllJobs(Pageable pageable) {
        return jobRepository.findAll(pageable);
    }

    public Page<Job> getFeed(String username, Pageable pageable) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> following = followRepository.findByFollower(currentUser).stream()
                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                .map(Follow::getFollowing)
                .collect(Collectors.toList());

        // Also include my own posts
        following.add(currentUser);

        return jobRepository.findByPostedByInOrderByPostedDateDesc(following, pageable);
    }

    public Page<Job> getJobsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepository.findByPostedByOrderByPostedDateDesc(user, pageable);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job createJob(Job job, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        job.setPostedBy(user);
        Job savedJob = jobRepository.save(job);

        // Notify followers
        List<User> followers = followRepository.findByFollowing(user).stream()
                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                .map(Follow::getFollower)
                .collect(Collectors.toList());

        for (User follower : followers) {
            Notification notification = new Notification(
                    follower,
                    user,
                    "JOB_POST",
                    user.getFullName() + " posted a new job: " + savedJob.getTitle(),
                    savedJob.getId());
            notificationRepository.save(notification);
        }

        return savedJob;
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);

        job.setTitle(jobDetails.getTitle());
        job.setCompany(jobDetails.getCompany());
        job.setJobUrl(jobDetails.getJobUrl());
        job.setJobType(jobDetails.getJobType());
        job.setBatchYear(jobDetails.getBatchYear());
        // PostedDate is typically not updated, or handled automatically

        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        Job job = getJobById(id);
        jobRepository.delete(job);
    }
}
