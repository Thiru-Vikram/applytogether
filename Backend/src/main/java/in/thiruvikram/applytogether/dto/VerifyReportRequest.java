package in.thiruvikram.applytogether.dto;

public class VerifyReportRequest {
    private Double currentLatitude;
    private Double currentLongitude;

    public VerifyReportRequest() {
    }

    public VerifyReportRequest(Double currentLatitude, Double currentLongitude) {
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
    }

    public Double getCurrentLatitude() {
        return currentLatitude;
    }

    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }

    public Double getCurrentLongitude() {
        return currentLongitude;
    }

    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }
}
