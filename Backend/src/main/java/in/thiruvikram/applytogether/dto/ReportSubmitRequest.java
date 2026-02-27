package in.thiruvikram.applytogether.dto;

public class ReportSubmitRequest {
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;

    public ReportSubmitRequest() {
    }

    public ReportSubmitRequest(String title, String description, Double latitude, Double longitude) {
        this.title = title;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
