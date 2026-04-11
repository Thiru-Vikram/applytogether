package in.thiruvikram.applytogether.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // Optional
    private String fullName;
    private String gender;
    private String passingYear;
}
