package in.thiruvikram.applytogether.dto;

public class ResolveReportRequest {
    private String proofPhotoUrl;
    private Double currentLatitude;
    private Double currentLongitude;

    public ResolveReportRequest() {
    }

    public ResolveReportRequest(String proofPhotoUrl, Double currentLatitude, Double currentLongitude) {
        this.proofPhotoUrl = proofPhotoUrl;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
    }

    public String getProofPhotoUrl() {
        return proofPhotoUrl;
    }

    public void setProofPhotoUrl(String proofPhotoUrl) {
        this.proofPhotoUrl = proofPhotoUrl;
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
