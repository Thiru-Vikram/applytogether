import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const COMMON_DEPARTMENTS = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
];

const POPULAR_COLLEGES = [
    "VIT Vellore",
    "VIT Chennai",
    "VIT AP",
    "Anna University",
    "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology",
    "BITS Pilani",
    "SRM KTR",
    "SRM Amravati",
    "SRM Ramapuram",
    "Amrita",
    "Apollo University - Chittoor",
    "SITAMS - Chittoor",
    "Other"
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        gender: 'Male',
        passingYear: '',
        collegeName: '',
        department: '',
        state: '',
        city: ''
    });

    const [collegeSearch, setCollegeSearch] = useState('');
    const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
    const [filteredColleges, setFilteredColleges] = useState([]);
    const [isCustomCollege, setIsCustomCollege] = useState(false);
    
    const [isCustomDept, setIsCustomDept] = useState(false);
    const [customDept, setCustomDept] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // College Autocomplete Logic
    useEffect(() => {
        if (collegeSearch.length > 1 && !isCustomCollege) {
            const filtered = POPULAR_COLLEGES.filter(c => 
                c.toLowerCase().includes(collegeSearch.toLowerCase())
            );
            setFilteredColleges(filtered);
            setShowCollegeSuggestions(true);
        } else {
            setShowCollegeSuggestions(false);
        }
    }, [collegeSearch, isCustomCollege]);

    const handleCollegeSelect = (college) => {
        if (college === 'Others') {
            setIsCustomCollege(true);
            setCollegeSearch('');
            setFormData({ ...formData, collegeName: '' });
        } else {
            setCollegeSearch(college);
            setFormData({ ...formData, collegeName: college });
            setIsCustomCollege(false);
        }
        setShowCollegeSuggestions(false);
    };

    const handleDeptChange = (e) => {
        const val = e.target.value;
        if (val === 'Others') {
            setIsCustomDept(true);
            setFormData({ ...formData, department: '' });
        } else {
            setIsCustomDept(false);
            setFormData({ ...formData, department: val });
        }
    };

    const capitalizeWords = (str) => {
        if (!str) return str;
        return str.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const finalCollege = capitalizeWords(isCustomCollege ? collegeSearch : formData.collegeName);
        const finalDept = isCustomDept ? customDept : formData.department;
        const finalCity = capitalizeWords(formData.city);

        if (!finalCollege) return setError("Please enter your College Name");
        if (!finalDept) return setError("Please enter your Department");

        setLoading(true);

        try {
            const payload = {
                ...formData,
                collegeName: finalCollege,
                department: finalDept,
                city: finalCity,
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

                                {/* Academic Information */}
                                <h5 className="fw-bold mb-3 text-primary">Academic Details</h5>
                                <Row className="g-3 mb-4">
                                    <Col md={12}>
                                        <Form.Group className="position-relative">
                                            <Form.Label className="small fw-bold">College Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={collegeSearch}
                                                onChange={(e) => {
                                                    setCollegeSearch(e.target.value);
                                                    if (isCustomCollege) setFormData({...formData, collegeName: e.target.value});
                                                }}
                                                placeholder={isCustomCollege ? "Enter exact college name from Google" : "Search your college..."}
                                            />
                                            {isCustomCollege && (
                                                <Form.Text className="text-info small">
                                                    Tip: Paste the exact official name from Google for better networking.
                                                </Form.Text>
                                            )}
                                            {!isCustomCollege && showCollegeSuggestions && (
                                                <ListGroup className="position-absolute w-100 z-3 shadow-sm mt-1">
                                                    {filteredColleges.map((c, i) => (
                                                        <ListGroup.Item 
                                                            key={i} 
                                                            action 
                                                            onClick={() => handleCollegeSelect(c)}
                                                            className="small py-2"
                                                        >
                                                            {c}
                                                        </ListGroup.Item>
                                                    ))}
                                                    <ListGroup.Item 
                                                        action 
                                                        onClick={() => handleCollegeSelect('Others')}
                                                        className="small py-2 text-primary fw-bold"
                                                    >
                                                        + Other (Manual Entry)
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">Department</Form.Label>
                                            <Form.Select 
                                                required
                                                onChange={handleDeptChange}
                                                className="py-2"
                                            >
                                                <option value="">Select Department</option>
                                                {COMMON_DEPARTMENTS.map((d, i) => (
                                                    <option key={i} value={d}>{d}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    {isCustomDept && (
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Enter Department</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    required
                                                    value={customDept}
                                                    onChange={(e) => setCustomDept(e.target.value)}
                                                    placeholder="Specify your dept"
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}
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
                                </Row>

                                {/* Location & Other Information */}
                                <h5 className="fw-bold mb-3 text-primary">Personal Details</h5>
                                <Row className="g-3 mb-4">
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
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">State</Form.Label>
                                            <Form.Select
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map((s, i) => (
                                                    <option key={i} value={s}>{s}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold">City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="Enter your city"
                                            />
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
