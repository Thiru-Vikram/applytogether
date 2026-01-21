package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.entity.Application;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.ApplicationService;
import in.thiruvikram.applytogether.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private AuthService authService;

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> applyToJob(@PathVariable Long jobId, Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(applicationService.applyToJob(user, jobId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(applicationService.getUserApplications(user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload,
            Principal principal) {
        String status = payload.get("status");
        if (status != null) {
            status = status.toUpperCase().trim();
        }
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, principal.getName()));
    }
}
