package in.thiruvikram.applytogether.dto;

public class AssignStaffRequest {
    private Long staffId;

    public AssignStaffRequest() {
    }

    public AssignStaffRequest(Long staffId) {
        this.staffId = staffId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }
}
