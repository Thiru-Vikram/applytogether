package in.thiruvikram.applytogether.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private String mostActiveBatch;
    private List<Map<String, Object>> userGrowth;
    private List<Map<String, Object>> batchDistribution;
}
