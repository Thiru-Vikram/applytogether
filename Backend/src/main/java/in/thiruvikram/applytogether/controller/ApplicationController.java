package in.thiruvikram.applytogether.controller;

import java.security.Principal;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.thiruvikram.applytogether.dto.UpdateApplicationStatusRequest;
import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController extends BaseController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> applyToJob(@PathVariable Long jobId, Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(applicationService.applyToJob(user, jobId));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(applicationService.getUserApplications(user));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest payload,
            Principal principal) {
        return ResponseEntity
                .ok(applicationService.updateApplicationStatus(id, payload.getStatus(), principal.getName()));
    }
}
