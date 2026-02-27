package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.dto.AssignStaffRequest;
import in.thiruvikram.applytogether.dto.ReportSubmitRequest;
import in.thiruvikram.applytogether.dto.ResolveReportRequest;
import in.thiruvikram.applytogether.dto.VerifyReportRequest;
import in.thiruvikram.applytogether.entity.Report;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.AuthService;
import in.thiruvikram.applytogether.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private AuthService authService;

    /**
     * Submit a new report (USER)
     */
    @PostMapping("/submit")
    public ResponseEntity<Report> submitReport(@RequestBody ReportSubmitRequest request, Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        Report report = reportService.submitReport(
                user,
                request.getTitle(),
                request.getDescription(),
                request.getLatitude(),
                request.getLongitude());
        return ResponseEntity.ok(report);
    }

    /**
     * Get all reports (ADMIN)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /**
     * Get my submitted reports (USER)
     */
    @GetMapping("/my-reports")
    public ResponseEntity<List<Report>> getMyReports(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(reportService.getMyReports(user));
    }

    /**
     * Get reports assigned to me (STAFF)
     */
    @GetMapping("/assigned")
    public ResponseEntity<List<Report>> getAssignedReports(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(reportService.getMyAssignedReports(user));
    }

    /**
     * Get all staff members (ADMIN)
     */
    @GetMapping("/staff")
    public ResponseEntity<List<User>> getAllStaff(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(reportService.getAllStaffUsers());
    }

    /**
     * Assign report to staff (ADMIN)
     */
    @PatchMapping("/{reportId}/assign")
    public ResponseEntity<Report> assignToStaff(
            @PathVariable Long reportId,
            @RequestBody AssignStaffRequest request,
            Principal principal) {
        User admin = authService.getUserByUsername(principal.getName());
        Report report = reportService.assignToStaff(reportId, request.getStaffId(), admin);
        return ResponseEntity.ok(report);
    }

    /**
     * Resolve report with proof (STAFF)
     */
    @PatchMapping("/{reportId}/resolve")
    public ResponseEntity<Report> resolveReport(
            @PathVariable Long reportId,
            @RequestBody ResolveReportRequest request,
            Principal principal) {
        User staff = authService.getUserByUsername(principal.getName());
        Report report = reportService.resolveReport(
                reportId,
                request.getProofPhotoUrl(),
                request.getCurrentLatitude(),
                request.getCurrentLongitude(),
                staff);
        return ResponseEntity.ok(report);
    }

    /**
     * Verify and close report (USER)
     */
    @PatchMapping("/{reportId}/verify")
    public ResponseEntity<Report> verifyReport(
            @PathVariable Long reportId,
            @RequestBody VerifyReportRequest request,
            Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        Report report = reportService.verifyAndClose(
                reportId,
                request.getCurrentLatitude(),
                request.getCurrentLongitude(),
                user);
        return ResponseEntity.ok(report);
    }
}
