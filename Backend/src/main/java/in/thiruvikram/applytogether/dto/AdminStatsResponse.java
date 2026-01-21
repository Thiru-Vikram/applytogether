package in.thiruvikram.applytogether.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private String mostActiveBatch;
    private java.util.List<java.util.Map<String, Object>> userGrowth;
    private java.util.List<java.util.Map<String, Object>> batchDistribution;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalJobs, long totalApplications, long newUsersThisWeek,
            long newUsersThisMonth, String mostActiveBatch, java.util.List<java.util.Map<String, Object>> userGrowth,
            java.util.List<java.util.Map<String, Object>> batchDistribution) {
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

    public java.util.List<java.util.Map<String, Object>> getUserGrowth() {
        return userGrowth;
    }

    public void setUserGrowth(java.util.List<java.util.Map<String, Object>> userGrowth) {
        this.userGrowth = userGrowth;
    }

    public java.util.List<java.util.Map<String, Object>> getBatchDistribution() {
        return batchDistribution;
    }

    public void setBatchDistribution(java.util.List<java.util.Map<String, Object>> batchDistribution) {
        this.batchDistribution = batchDistribution;
    }
}
