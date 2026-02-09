package in.thiruvikram.applytogether.dto;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // Optional
    private String fullName;
    private String gender;
    private String passingYear;

    public RegisterRequest() {
    }

    public RegisterRequest(String username, String email, String password, String role, String fullName, String gender,
            String passingYear) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.gender = gender;
        this.passingYear = passingYear;
        this.passingYear = passingYear;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPassingYear() {
        return passingYear;
    }

    public void setPassingYear(String passingYear) {
        this.passingYear = passingYear;
    }

}
