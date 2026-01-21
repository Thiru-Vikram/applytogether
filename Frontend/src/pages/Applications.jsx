import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Table, Form } from 'react-bootstrap';
import api from '../api/axios';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my-applications');
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load your applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      setError(null);
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update status', err);
      setError('Communication with server failed. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED': return <Badge bg="primary">Applied</Badge>;
      case 'INTERVIEWING': return <Badge bg="warning" text="dark">Interviewing</Badge>;
      case 'OFFERED': return <Badge bg="success">Offered</Badge>;
      case 'REJECTED': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading your progress...</p>
      </Container>
    );
  }

  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === 'INTERVIEWING').length,
    offers: applications.filter(a => a.status === 'OFFERED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length
  };

  return (
    <Container className="fade-in py-5">
      <h1 className="display-6 fw-bold mb-4">Application Tracker</h1>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-primary text-white p-3 h-100 transition hover-shadow">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold opacity-75">Total Applications</h6>
              <h2 className="display-5 fw-bold mb-0">{stats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 border-start border-warning border-5 h-100 transition hover-shadow">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold text-secondary">Interviewing</h6>
              <h2 className="display-5 fw-bold mb-0">{stats.interviewing}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 border-start border-success border-5 h-100 transition hover-shadow">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold text-secondary">Offers Received</h6>
              <h2 className="display-5 fw-bold mb-0">{stats.offers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-white p-3 border-start border-danger border-5 h-100 transition hover-shadow">
            <Card.Body>
              <h6 className="text-uppercase small fw-bold text-secondary">Rejected</h6>
              <h2 className="display-5 fw-bold mb-0">{stats.rejected}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3 border-0">Job Detail</th>
              <th className="py-3 border-0">Applied Date</th>
              <th className="py-3 border-0">Status</th>
              <th className="py-3 border-0">Actions</th>
              <th className="px-4 py-3 border-0 text-end">Link</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-secondary">
                  You haven't marked any jobs as applied yet.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="align-middle">
                  <td className="px-4 py-4">
                    <div className="fw-bold text-dark">{app.job.title}</div>
                    <div className="text-primary small">
                        {app.job.company} 
                        {app.job.batchYear && (
                            <span className="ms-1 text-secondary opacity-75" style={{ fontSize: '0.75rem' }}>
                                • {app.job.batchYear} Batch
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="text-secondary">
                    {new Date(app.appliedAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      className="w-auto border shadow-sm"
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEWING">Interviewing</option>
                      <option value="OFFERED">Offered</option>
                      <option value="REJECTED">Rejected</option>
                    </Form.Select>
                  </td>
                  <td className="px-4 text-end">
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      href={app.job.jobUrl}
                      target="_blank"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Applications;
