import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddAdmin = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                role: 'ADMIN'
            };
            await api.post('/auth/register', payload);
            setSuccess(`Admin account for "${formData.username}" created successfully!`);
            setFormData({ username: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="fade-in py-5 mt-4">
            <Row className="justify-content-center">
                <Col md={8} lg={5}>
                    <Card className="shadow border-0 p-4 transition hover-shadow">
                        <Card.Body>
                            <h2 className="text-center fw-bold mb-4">Add New Admin</h2>
                            <p className="text-center text-secondary small mb-4">Create a new administrative account for your team.</p>
                            
                            {error && <Alert variant="danger" className="text-center small">{error}</Alert>}
                            {success && <Alert variant="success" className="text-center small">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="admin_username"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="admin@applytogether.com"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Temporary Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="py-2"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-secondary" 
                                        className="w-50 py-2 fw-bold"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Back
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        className="w-100 py-2 fw-bold" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Admin'}
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

export default AddAdmin;
