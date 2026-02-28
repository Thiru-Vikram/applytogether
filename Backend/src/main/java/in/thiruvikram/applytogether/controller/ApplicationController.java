package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.ApplicationService;
import in.thiruvikram.applytogether.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    public ApplicationController(ApplicationService applicationService, AuthService authService) {
        this.applicationService = applicationService;
        this.authService = authService;
    }

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> applyToJob(@PathVariable Long jobId, Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(applicationService.applyToJob(user, jobId));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(applicationService.getUserApplications(user));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Status field is required"));
        }
        status = status.toUpperCase().trim();
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, principal.getName()));
    }
}
