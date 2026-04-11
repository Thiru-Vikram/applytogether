package in.thiruvikram.applytogether.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateApplicationStatusRequest {
    private String status;
}