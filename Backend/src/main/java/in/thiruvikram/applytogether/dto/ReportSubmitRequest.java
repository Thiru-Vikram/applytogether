package in.thiruvikram.applytogether.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportSubmitRequest {
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
}
