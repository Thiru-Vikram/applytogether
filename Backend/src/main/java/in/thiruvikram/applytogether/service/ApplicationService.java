package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import in.thiruvikram.applytogether.service.AuthService;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private AuthService authService;

    public Application applyToJob(User user, Long jobId) {
        Optional<Application> existing = applicationRepository.findByUserAndJobId(user, jobId);
        if (existing.isPresent()) {
            return existing.get();
        }

        Job job = jobService.getJobById(jobId);
        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setStatus("APPLIED");

        return applicationRepository.save(application);
    }

    public List<Application> getUserApplications(User user) {
        return applicationRepository.findByUser(user);
    }

    public Application updateApplicationStatus(Long applicationId, String status, String username) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User currentUser = authService.getUserByUsername(username);

        // Authorization: Only Admin or the person who posted the job can update status
        boolean isAdmin = currentUser.getRole().equals("ADMIN");
        boolean isJobPoster = application.getJob().getPostedBy() != null &&
                application.getJob().getPostedBy().getUsername().equals(username);

        if (!isAdmin && !isJobPoster) {
            throw new RuntimeException("Unauthorized to update application status");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
