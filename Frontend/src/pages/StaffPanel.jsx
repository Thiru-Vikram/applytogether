import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../api/axios";

const StaffPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [proofPhotoUrl, setProofPhotoUrl] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  console.log("StaffPanel component rendered");

  useEffect(() => {
    console.log("StaffPanel useEffect - fetching reports");
    fetchAssignedReports();
  }, []);

  const fetchAssignedReports = async () => {
    try {
      const response = await api.get("/reports/assigned");
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch assigned reports. Please check if you have staff access.",
      );
      setLoading(false);
    }
  };

  const handleResolveClick = (report) => {
    setSelectedReport(report);
    setProofPhotoUrl("");
    setCurrentLocation(null);
    setLocationError("");
    setShowResolveModal(true);
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError("");
        },
        (error) => {
          setLocationError(
            "Unable to get your location. Please enable location services.",
          );
        },
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleResolveSubmit = async () => {
    if (!proofPhotoUrl) {
      setError("Please provide a proof photo URL");
      return;
    }

    if (!currentLocation) {
      setError("Location not available. Please enable location services.");
      return;
    }

    // Check distance
    const distance = calculateDistance(
      selectedReport.latitude,
      selectedReport.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );

    if (distance > 100) {
      setError(
        `You must be at the issue location to mark this as resolved. You are ${Math.round(distance)}m away.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/reports/${selectedReport.id}/resolve`, {
        proofPhotoUrl,
        currentLatitude: currentLocation.latitude,
        currentLongitude: currentLocation.longitude,
      });
      setShowResolveModal(false);
      fetchAssignedReports();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve report");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <Badge bg="warning" text="dark">
            In Progress
          </Badge>
        );
      case "RESOLVED":
        return <Badge bg="info">Resolved</Badge>;
      case "CLOSED":
        return <Badge bg="success">Closed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading assigned reports...</p>
      </Container>
    );
  }

  const inProgressReports = reports.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length;
  const closedReports = reports.filter((r) => r.status === "CLOSED").length;

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">Staff Panel</h1>
        <p className="text-muted">Reports assigned to you</p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">In Progress</p>
                  <h3 className="fw-bold text-warning">{inProgressReports}</h3>
                </div>
                <i className="bi bi-hourglass-split fs-1 text-warning opacity-25"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Resolved</p>
                  <h3 className="fw-bold text-info">{resolvedReports}</h3>
                </div>
                <i className="bi bi-check-circle fs-1 text-info opacity-25"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Closed</p>
                  <h3 className="fw-bold text-success">{closedReports}</h3>
                </div>
                <i className="bi bi-check2-all fs-1 text-success opacity-25"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">My Assigned Reports</h5>
        </Card.Header>
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-secondary">
                  No reports assigned to you yet
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td className="fw-bold">{report.title}</td>
                  <td>
                    <small className="text-muted">
                      {report.description?.substring(0, 60)}...
                    </small>
                  </td>
                  <td>
                    {report.submittedBy?.fullName ||
                      report.submittedBy?.username}
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    {report.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleResolveClick(report)}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Mark Resolved
                      </Button>
                    )}
                    {report.status === "RESOLVED" && (
                      <Badge bg="info">Waiting for user verification</Badge>
                    )}
                    {report.status === "CLOSED" && (
                      <Badge bg="success">Verified & Closed</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Resolve Modal */}
      <Modal
        show={showResolveModal}
        onHide={() => setShowResolveModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mark Report as Resolved</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <div className="mb-4">
                <h6 className="fw-bold">Report: {selectedReport.title}</h6>
                <p className="text-muted mb-2">{selectedReport.description}</p>
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    Location: {selectedReport.latitude},{" "}
                    {selectedReport.longitude}
                  </small>
                </div>
              </div>

              {locationError ? (
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {locationError}
                  <Button
                    size="sm"
                    variant="warning"
                    className="ms-2"
                    onClick={getCurrentLocation}
                  >
                    Retry
                  </Button>
                </Alert>
              ) : currentLocation ? (
                <Alert variant="success">
                  <i className="bi bi-check-circle me-2"></i>
                  Location acquired: {currentLocation.latitude.toFixed(6)},{" "}
                  {currentLocation.longitude.toFixed(6)}
                </Alert>
              ) : (
                <Alert variant="info">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Getting your location...
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>
                  Proof Photo URL <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter the URL of the proof photo"
                  value={proofPhotoUrl}
                  onChange={(e) => setProofPhotoUrl(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Upload your photo to a service (e.g., Imgur, Cloudinary) and
                  paste the URL here
                </Form.Text>
              </Form.Group>

              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                You must be within 100 meters of the issue location to mark it
                as resolved.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResolveModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleResolveSubmit}
            disabled={submitting || !currentLocation}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Resolving...
              </>
            ) : (
              "Mark as Resolved"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffPanel;
