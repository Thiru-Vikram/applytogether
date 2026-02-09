import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        gender: 'Male',
        passingYear: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                role: 'USER'
            };
            await api.post('/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="fade-in py-5 mt-4">
            <Row className="justify-content-center">
                <Col md={10} lg={7}>
                    <Card className="shadow border-0 p-4 transition hover-shadow">
                        <Card.Body>
                            <h2 className="text-center fw-bold mb-4">Create Account</h2>
                            
                            {error && <Alert variant="danger" className="text-center small">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                {/* Account Information */}
                                <h5 className="fw-bold mb-3 text-primary">Account Details</h5>
                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="johndoe123"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@example.com"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder="John Doe"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Other Details */}
                                <h5 className="fw-bold mb-3 text-primary">Other Details</h5>
                                <Row className="g-3 mb-4">
                                     <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Passing Year</Form.Label>
                                            <Form.Control
                                                type="number"
                                                required
                                                value={formData.passingYear}
                                                onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                                                placeholder="2025"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Gender</Form.Label>
                                            <Form.Select 
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-100 py-3 fw-bold mt-2" 
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Finish Registration'}
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="small text-secondary mb-0">
                                    Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login here</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
