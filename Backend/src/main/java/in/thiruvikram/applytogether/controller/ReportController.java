package in.thiruvikram.applytogether.controller;

import in.thiruvikram.applytogether.dto.AssignStaffRequest;
import in.thiruvikram.applytogether.dto.ReportSubmitRequest;
import in.thiruvikram.applytogether.dto.ResolveReportRequest;
import in.thiruvikram.applytogether.dto.VerifyReportRequest;
import in.thiruvikram.applytogether.entity.Report;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.AuthService;
import in.thiruvikram.applytogether.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    public ReportController(ReportService reportService, AuthService authService) {
        this.reportService = reportService;
        this.authService = authService;
    }

    /**
     * Submit a new report (USER)
     */
    @PostMapping("/submit")
    @PreAuthorize("isAuthenticated()")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /**
     * Get my submitted reports (USER)
     */
    @GetMapping("/my-reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Report>> getMyReports(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(reportService.getMyReports(user));
    }

    /**
     * Get reports assigned to me (STAFF)
     */
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAssignedReports(Principal principal) {
        User user = authService.getUserByUsername(principal.getName());
        return ResponseEntity.ok(reportService.getMyAssignedReports(user));
    }

    /**
     * Get all staff members (ADMIN)
     */
    @GetMapping("/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllStaff() {
        return ResponseEntity.ok(reportService.getAllStaffUsers());
    }

    /**
     * Assign report to staff (ADMIN)
     */
    @PatchMapping("/{reportId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
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
    @PreAuthorize("isAuthenticated()")
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
