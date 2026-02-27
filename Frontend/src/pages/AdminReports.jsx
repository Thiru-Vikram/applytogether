import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../api/axios";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  useEffect(() => {
    fetchReportsAndStaff();
  }, []);

  const fetchReportsAndStaff = async () => {
    try {
      const [reportsRes, staffRes] = await Promise.all([
        api.get("/reports/all"),
        api.get("/reports/staff"),
      ]);
      setReports(reportsRes.data);
      setStaffList(staffRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const handleAssignClick = (report) => {
    setSelectedReport(report);
    setSelectedStaffId("");
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedStaffId) {
      setError("Please select a staff member");
      return;
    }

    try {
      await api.patch(`/reports/${selectedReport.id}/assign`, {
        staffId: parseInt(selectedStaffId),
      });
      setShowAssignModal(false);
      fetchReportsAndStaff();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign report");
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
        <p className="mt-3">Loading reports...</p>
      </Container>
    );
  }

  const openReports = reports.filter((r) => r.status === "OPEN").length;
  const inProgressReports = reports.filter(
    (r) => r.status === "IN_PROGRESS",
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length;
  const closedReports = reports.filter((r) => r.status === "CLOSED").length;

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">Admin - Report Management</h1>
        <p className="text-muted">Review and assign reports to staff members</p>
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
          <h5 className="mb-0">All Reports</h5>
        </Card.Header>
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-secondary">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>
                    <div className="fw-bold">{report.title}</div>
                    <small className="text-muted">
                      {report.description?.substring(0, 50)}...
                    </small>
                  </td>
                  <td>
                    {report.submittedBy?.fullName ||
                      report.submittedBy?.username}
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    {report.assignedTo ? (
                      <span className="text-primary">
                        {report.assignedTo.fullName ||
                          report.assignedTo.username}
                      </span>
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )}
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    {report.status === "OPEN" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAssignClick(report)}
                      >
                        Assign to Staff
                      </Button>
                    )}
                    {report.status === "IN_PROGRESS" && (
                      <Badge bg="warning" text="dark">
                        Waiting for staff
                      </Badge>
                    )}
                    {report.status === "RESOLVED" && (
                      <Badge bg="info">Waiting for user</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <div className="mb-3">
                <h6>Report: {selectedReport.title}</h6>
                <p className="text-muted small mb-0">
                  {selectedReport.description}
                </p>
              </div>
              <Form.Group>
                <Form.Label>Select Staff Member</Form.Label>
                <Form.Select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                  <option value="">Choose a staff member...</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullName || staff.username} ({staff.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignSubmit}>
            Assign & Mark In Progress
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminReports;
