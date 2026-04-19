package in.thiruvikram.applytogether.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateApplicationStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;
}