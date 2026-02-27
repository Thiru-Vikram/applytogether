import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Modal,
  Badge,
  Table,
} from "react-bootstrap";
import api from "../api/axios";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Verify state
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const response = await api.get("/reports/my-reports");
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reports");
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    setTitle("");
    setDescription("");
    setLocation(null);
    setLocationError("");
    setShowSubmitModal(true);
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
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

  const handleSubmitReport = async () => {
    if (!title || !description) {
      setError("Please provide title and description");
      return;
    }

    if (!location) {
      setError("Location not available. Please enable location services.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reports/submit", {
        title,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setShowSubmitModal(false);
      fetchMyReports();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyClick = (report) => {
    setSelectedReport(report);
    setCurrentLocation(null);
    setShowVerifyModal(true);
    getVerificationLocation();
  };

  const getVerificationLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(
            "Unable to get your location. Please enable location services.",
          );
        },
      );
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

  const handleVerifySubmit = async () => {
    if (!currentLocation) {
      setError("Location not available. Please enable location services.");
      return;
    }

    const distance = calculateDistance(
      selectedReport.latitude,
      selectedReport.longitude,
      currentLocation.latitude,
      currentLocation.longitude,
    );

    if (distance > 100) {
      setError(
        `Go to the issue location to verify. You are ${Math.round(distance)}m away.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/reports/${selectedReport.id}/verify`, {
        currentLatitude: currentLocation.latitude,
        currentLongitude: currentLocation.longitude,
      });
      setShowVerifyModal(false);
      fetchMyReports();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify report");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
        return <Badge bg="danger">Open</Badge>;
      case "IN_PROGRESS":
        return (
          <Badge bg="warning" text="dark">
            In Progress
          </Badge>
        );
      case "RESOLVED":
        return <Badge bg="info">Resolved - Verify</Badge>;
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
        <p className="mt-3">Loading your reports...</p>
      </Container>
    );
  }

  const openReports = reports.filter((r) => r.status === "OPEN").length;
  const inProgressReports = reports.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length;
  const closedReports = reports.filter((r) => r.status === "CLOSED").length;
  const totalCoins = reports.reduce(
    (sum, r) => sum + (r.civicCoinsEarned || 0),
    0,
  );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold mb-2 display-5">My Reports</h1>
          <p className="text-muted mb-0">Track your civic issue reports</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleSubmitClick}>
          <i className="bi bi-plus-circle me-2"></i>
          Submit New Report
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Open</p>
                  <h3 className="fw-bold text-danger">{openReports}</h3>
                </div>
                <i className="bi bi-exclamation-circle fs-1 text-danger opacity-25"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
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
        <Col lg={3} md={6}>
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
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Civic Coins</p>
                  <h3 className="fw-bold text-success">{totalCoins}</h3>
                </div>
                <i className="bi bi-coin fs-1 text-success opacity-25"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">All My Reports</h5>
        </Card.Header>
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-secondary">
                  No reports yet. Submit your first civic issue report!
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="fw-bold">{report.title}</div>
                    <small className="text-muted">
                      {report.description?.substring(0, 50)}...
                    </small>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    {report.assignedTo ? (
                      <span className="text-primary">
                        {report.assignedTo.fullName ||
                          report.assignedTo.username}
                      </span>
                    ) : (
                      <span className="text-muted">Not yet assigned</span>
                    )}
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    {report.status === "RESOLVED" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleVerifyClick(report)}
                      >
                        <i className="bi bi-check2-all me-1"></i>
                        Verify & Close
                      </Button>
                    )}
                    {report.status === "CLOSED" && report.civicCoinsEarned && (
                      <Badge bg="success">
                        <i className="bi bi-coin me-1"></i>+
                        {report.civicCoinsEarned} coins
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Submit Report Modal */}
      <Modal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Broken street light on Main Street"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

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
            ) : location ? (
              <Alert variant="success">
                <i className="bi bi-check-circle me-2"></i>
                Location captured: {location.latitude.toFixed(6)},{" "}
                {location.longitude.toFixed(6)}
              </Alert>
            ) : (
              <Alert variant="info">
                <Spinner animation="border" size="sm" className="me-2" />
                Getting your location...
              </Alert>
            )}

            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Your current location will be used as the issue location. Make
              sure you're at the site.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitReport}
            disabled={submitting || !location}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Verify Report Modal */}
      <Modal
        show={showVerifyModal}
        onHide={() => setShowVerifyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify & Close Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <div className="mb-4">
                <h6 className="fw-bold">{selectedReport.title}</h6>
                <p className="text-muted">{selectedReport.description}</p>

                {selectedReport.assignedTo && (
                  <p className="mb-2">
                    <strong>Resolved by:</strong>{" "}
                    {selectedReport.assignedTo.fullName ||
                      selectedReport.assignedTo.username}
                  </p>
                )}

                {selectedReport.proofPhotoUrl && (
                  <div className="mb-3">
                    <strong className="d-block mb-2">Proof Photo:</strong>
                    <img
                      src={selectedReport.proofPhotoUrl}
                      alt="Proof"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <Alert variant="warning" style={{ display: "none" }}>
                      Unable to load proof photo. URL:{" "}
                      {selectedReport.proofPhotoUrl}
                    </Alert>
                  </div>
                )}
              </div>

              {currentLocation ? (
                <Alert variant="success">
                  <i className="bi bi-check-circle me-2"></i>
                  Location verified
                </Alert>
              ) : (
                <Alert variant="info">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verifying your location...
                </Alert>
              )}

              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                You must be within 100 meters of the original issue location to
                verify. You'll earn 10 Civic Coins!
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleVerifySubmit}
            disabled={submitting || !currentLocation}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              "Verify & Close"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyReports;
