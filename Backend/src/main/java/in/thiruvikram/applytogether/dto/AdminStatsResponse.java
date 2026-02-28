package in.thiruvikram.applytogether.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private String mostActiveBatch;
    private List<Map<String, Object>> userGrowth;
    private List<Map<String, Object>> batchDistribution;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalJobs, long totalApplications, long newUsersThisWeek,
            long newUsersThisMonth, String mostActiveBatch, List<Map<String, Object>> userGrowth,
            List<Map<String, Object>> batchDistribution) {
        this.totalUsers = totalUsers;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.newUsersThisWeek = newUsersThisWeek;
        this.newUsersThisMonth = newUsersThisMonth;
        this.mostActiveBatch = mostActiveBatch;
        this.userGrowth = userGrowth;
        this.batchDistribution = batchDistribution;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getNewUsersThisWeek() {
        return newUsersThisWeek;
    }

    public void setNewUsersThisWeek(long newUsersThisWeek) {
        this.newUsersThisWeek = newUsersThisWeek;
    }

    public long getNewUsersThisMonth() {
        return newUsersThisMonth;
    }

    public void setNewUsersThisMonth(long newUsersThisMonth) {
        this.newUsersThisMonth = newUsersThisMonth;
    }

    public String getMostActiveBatch() {
        return mostActiveBatch;
    }

    public void setMostActiveBatch(String mostActiveBatch) {
        this.mostActiveBatch = mostActiveBatch;
    }

    public List<Map<String, Object>> getUserGrowth() {
        return userGrowth;
    }

    public void setUserGrowth(List<Map<String, Object>> userGrowth) {
        this.userGrowth = userGrowth;
    }

    public List<Map<String, Object>> getBatchDistribution() {
        return batchDistribution;
    }

    public void setBatchDistribution(List<Map<String, Object>> batchDistribution) {
        this.batchDistribution = batchDistribution;
    }
}
