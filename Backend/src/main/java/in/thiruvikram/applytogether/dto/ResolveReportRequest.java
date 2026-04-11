package in.thiruvikram.applytogether.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolveReportRequest {
    private String proofPhotoUrl;
    private Double currentLatitude;
    private Double currentLongitude;
}
