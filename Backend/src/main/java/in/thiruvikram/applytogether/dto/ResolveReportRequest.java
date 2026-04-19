package in.thiruvikram.applytogether.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolveReportRequest {
    @NotBlank(message = "Proof photo URL is required")
    private String proofPhotoUrl;

    @NotNull(message = "Current latitude is required")
    private Double currentLatitude;

    @NotNull(message = "Current longitude is required")
    private Double currentLongitude;
}
