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

import in.thiruvikram.applytogether.dto.AssignStaffRequest;
import in.thiruvikram.applytogether.dto.ReportSubmitRequest;
import in.thiruvikram.applytogether.dto.ResolveReportRequest;
import in.thiruvikram.applytogether.dto.VerifyReportRequest;
import in.thiruvikram.applytogether.entity.Report;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController extends BaseController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Submit a new report (USER)
     */
    @PostMapping("/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Report> submitReport(@Valid @RequestBody ReportSubmitRequest request, Principal principal) {
        User user = getCurrentUser(principal);
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
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(reportService.getMyReports(user));
    }

    /**
     * Get reports assigned to me (STAFF)
     */
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAssignedReports(Principal principal) {
        User user = getCurrentUser(principal);
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
            @Valid @RequestBody AssignStaffRequest request,
            Principal principal) {
        User admin = getCurrentUser(principal);
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
            @Valid @RequestBody ResolveReportRequest request,
            Principal principal) {
        User staff = getCurrentUser(principal);
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
            @Valid @RequestBody VerifyReportRequest request,
            Principal principal) {
        User user = getCurrentUser(principal);
        Report report = reportService.verifyAndClose(
                reportId,
                request.getCurrentLatitude(),
                request.getCurrentLongitude(),
                user);
        return ResponseEntity.ok(report);
    }
}
