package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.Job;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final AuthService authService;

    public ApplicationService(ApplicationRepository applicationRepository, JobService jobService,
            AuthService authService) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
        this.authService = authService;
    }

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

        // Authorization: Admins, job posters, or the applicant can update status
        boolean isAdmin = currentUser.getRole().equals("ADMIN");
        boolean isJobPoster = application.getJob().getPostedBy() != null &&
                application.getJob().getPostedBy().getUsername().equals(username);
        boolean isApplicant = application.getUser() != null &&
                application.getUser().getUsername().equals(username);

        if (!isAdmin && !isJobPoster && !isApplicant) {
            throw new RuntimeException("Unauthorized to update application status");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
