package in.thiruvikram.applytogether.service;

import in.thiruvikram.applytogether.entity.Notification;
import in.thiruvikram.applytogether.entity.Report;
import in.thiruvikram.applytogether.entity.User;
import in.thiruvikram.applytogether.repository.NotificationRepository;
import in.thiruvikram.applytogether.repository.ReportRepository;
import in.thiruvikram.applytogether.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private static final double MAX_DISTANCE_METERS = 100.0;
    private static final int CIVIC_COINS_REWARD = 10;

    /**
     * Submit a new report
     */
    public Report submitReport(User user, String title, String description, Double latitude, Double longitude) {
        Report report = new Report(title, description, latitude, longitude, "OPEN", user);
        return reportRepository.save(report);
    }

    /**
     * Get all reports (for Admin)
     */
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get reports submitted by a user
     */
    public List<Report> getMyReports(User user) {
        return reportRepository.findBySubmittedBy(user);
    }

    /**
     * Get reports assigned to a staff member
     */
    public List<Report> getMyAssignedReports(User staff) {
        // Allow both STAFF and ADMIN to access (admins might want to test)
        if (!"STAFF".equals(staff.getRole()) && !"ADMIN".equals(staff.getRole())) {
            throw new RuntimeException("Only staff members can access assigned reports");
        }
        return reportRepository.findByAssignedTo(staff);
    }

    /**
     * Get all staff members
     */
    public List<User> getAllStaffUsers() {
        return userRepository.findByRole("STAFF");
    }

    /**
     * Assign a report to a staff member (Admin only)
     */
    public Report assignToStaff(Long reportId, Long staffId, User admin) {
        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("Only admins can assign reports");
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found"));

        if (!"STAFF".equals(staff.getRole())) {
            throw new RuntimeException("Can only assign to staff members");
        }

        report.setAssignedTo(staff);
        report.setStatus("IN_PROGRESS");
        Report savedReport = reportRepository.save(report);

        // Send notification to user
        String message = "Your report has been assigned to " + staff.getFullName() + " and is In Progress";
        Notification notification = new Notification(
                report.getSubmittedBy(),
                admin,
                "REPORT_ASSIGNED",
                message,
                reportId);
        notificationRepository.save(notification);

        return savedReport;
    }

    /**
     * Resolve a report with GPS verification (Staff only)
     */
    public Report resolveReport(Long reportId, String proofPhotoUrl, Double currentLat, Double currentLng, User staff) {
        if (!"STAFF".equals(staff.getRole())) {
            throw new RuntimeException("Only staff members can resolve reports");
        }

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (report.getAssignedTo() == null || !report.getAssignedTo().getId().equals(staff.getId())) {
            throw new RuntimeException("This report is not assigned to you");
        }

        // GPS validation
        double distance = calculateDistance(report.getLatitude(), report.getLongitude(), currentLat, currentLng);
        if (distance > MAX_DISTANCE_METERS) {
            throw new RuntimeException("You must be at the issue location to mark this as resolved. You are " +
                    Math.round(distance) + "m away.");
        }

        report.setStatus("RESOLVED");
        report.setProofPhotoUrl(proofPhotoUrl);
        report.setResolvedAt(LocalDateTime.now());
        Report savedReport = reportRepository.save(report);

        // Send notification to user
        String message = "Your issue has been resolved! Please verify.";
        Notification notification = new Notification(
                report.getSubmittedBy(),
                staff,
                "REPORT_RESOLVED",
                message,
                reportId);
        notificationRepository.save(notification);

        return savedReport;
    }

    /**
     * Verify and close a report with GPS verification (User only)
     */
    public Report verifyAndClose(Long reportId, Double currentLat, Double currentLng, User user) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getSubmittedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You can only verify your own reports");
        }

        if (!"RESOLVED".equals(report.getStatus())) {
            throw new RuntimeException("Report must be resolved before verification");
        }

        // GPS validation
        double distance = calculateDistance(report.getLatitude(), report.getLongitude(), currentLat, currentLng);
        if (distance > MAX_DISTANCE_METERS) {
            throw new RuntimeException("Go to the issue location to verify. You are " +
                    Math.round(distance) + "m away.");
        }

        report.setStatus("CLOSED");
        report.setVerifiedAt(LocalDateTime.now());
        report.setCivicCoinsEarned(CIVIC_COINS_REWARD);
        Report savedReport = reportRepository.save(report);

        // Send notification to staff
        String message = "Your resolved report has been verified by " + user.getFullName();
        Notification notification = new Notification(
                report.getAssignedTo(),
                user,
                "REPORT_VERIFIED",
                message,
                reportId);
        notificationRepository.save(notification);

        return savedReport;
    }

    /**
     * Calculate distance between two GPS coordinates using Haversine formula
     * Returns distance in meters
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371000; // meters

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
