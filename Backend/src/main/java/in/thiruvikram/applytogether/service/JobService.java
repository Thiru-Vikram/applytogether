package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private in.thiruvikram.applytogether.repository.UserRepository userRepository;

    @Autowired
    private in.thiruvikram.applytogether.repository.FollowRepository followRepository;

    @Autowired
    private in.thiruvikram.applytogether.repository.NotificationRepository notificationRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByPostedDateDesc();
    }

    public List<Job> getFeed(String username) {
        in.thiruvikram.applytogether.entity.User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<in.thiruvikram.applytogether.entity.User> following = followRepository.findByFollower(currentUser).stream()
                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                .map(in.thiruvikram.applytogether.entity.Follow::getFollowing)
                .collect(java.util.stream.Collectors.toList());

        // Also include my own posts? Optional. Let's include them for now so the feed
        // isn't empty.
        following.add(currentUser);

        return jobRepository.findByPostedByInOrderByPostedDateDesc(following);
    }

    public List<Job> getJobsByUser(Long userId) {
        in.thiruvikram.applytogether.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Since we don't have a specific method in repo for this yet, let's just make a
        // list of 1 user
        return jobRepository.findByPostedByInOrderByPostedDateDesc(java.util.Collections.singletonList(user));
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job createJob(Job job, String username) {
        in.thiruvikram.applytogether.entity.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        job.setPostedBy(user);
        Job savedJob = jobRepository.save(job);

        // Notify followers
        List<in.thiruvikram.applytogether.entity.User> followers = followRepository.findByFollowing(user).stream()
                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                .map(in.thiruvikram.applytogether.entity.Follow::getFollower)
                .collect(java.util.stream.Collectors.toList());

        for (in.thiruvikram.applytogether.entity.User follower : followers) {
            in.thiruvikram.applytogether.entity.Notification notification = new in.thiruvikram.applytogether.entity.Notification(
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
