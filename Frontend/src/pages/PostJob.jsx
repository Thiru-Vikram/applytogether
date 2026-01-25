import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        jobUrl: '',
        jobType: 'Full-time',
        batchYear: '2025'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/jobs', formData);
            navigate('/jobs');
        } catch (err) {
            setError('Failed to post job. Please check if you have admin permissions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="fade-in py-5 mt-4">
            <Row className="justify-content-center">
                <Col md={10} lg={6}>
                    <Card className="shadow border-0 p-4 transition hover-shadow">
                        <Card.Body>
                            <h2 className="fw-bold mb-4">Post a New Job</h2>
                            
                            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Job Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Senior Software Engineer"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Google"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Job URL (Application Link)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        required
                                        value={formData.jobUrl}
                                        onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                        placeholder="https://company.com/careers/job-123"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold">Job Type</Form.Label>
                                            <Form.Select 
                                                value={formData.jobType} 
                                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                                className="py-2"
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold">Eligibility (Batch Year)</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                placeholder="e.g. 2024, 2025"
                                                value={formData.batchYear} 
                                                onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                                                className="py-2"
                                            />
                                            <Form.Text className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                Use commas to separate multiple years (e.g. 2024, 2025). Use "All" for everyone.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <div className="d-flex gap-3">
                                    <Button 
                                        variant="outline-secondary" 
                                        className="flex-grow-1 py-2 fw-bold"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        className="flex-grow-2 w-100 py-2 fw-bold"
                                        disabled={loading}
                                    >
                                        {loading ? 'Posting...' : 'Post Job'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PostJob;
