import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SearchUsers = () => {
    // User Search State
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Global Jobs State
    const [globalJobs, setGlobalJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [key, setKey] = useState('jobs'); // Tab state

    useEffect(() => {
        fetchExploreData();
    }, []);

    const fetchExploreData = async () => {
        setJobsLoading(true);
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/applications/my-applications')
            ]);
            setGlobalJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
            // Defensive: check for app.job existance to avoid orphaned apps crash
            const appliedIds = (appsRes.data || [])
                .filter(app => app && app.job)
                .map(app => app.job.id);
            setAppliedJobIds(appliedIds);
        } catch (err) {
            console.error("Failed to fetch explore data", err);
        } finally {
            setJobsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearchLoading(true);
        setSearchError(null);
        setHasSearched(true);
        
        try {
            const res = await api.get(`/users/search?query=${query}`);
            setResults(Array.isArray(res.data) ? res.data : []);
            setKey('people'); // Switch to people tab on search
        } catch (err) {
            console.error(err);
            setSearchError('Failed to search users.');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleMarkApplied = async (jobId) => {
        try {
          await api.post(`/applications/apply/${jobId}`);
          setAppliedJobIds(prev => [...prev, jobId]);
        } catch (err) {
          console.error('Failed to mark as applied', err);
        }
    };

    // Calculate quick stats
    const totalGlobalJobs = globalJobs.length;
    const appliedCount = appliedJobIds.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = globalJobs.filter(j => {
        if (!j.postedDate) return false;
        const jobDate = new Date(j.postedDate);
        jobDate.setHours(0, 0, 0, 0);
        return jobDate.getTime() === today.getTime();
    }).length;
    const totalPeople = results.length; // For people tab

    const StatCard = ({ title, value, icon, color }) => (
        <Card className="border-0 shadow-sm h-100 rounded-4 transition hover-shadow">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <p className="text-secondary small fw-bold mb-1 text-uppercase tracking-wider">{title}</p>
                        <h2 className="fw-black mb-0">{value}</h2>
                    </div>
                    <div className={`p-3 rounded-4 bg-${color}-light text-${color}`}>
                        <i className={`bi bi-${icon} fs-3`}></i>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container className="py-5" id="explore-page-root">
            <div className="text-center mb-5">
                <h1 className="fw-bold mb-3 display-4">Explore</h1>
                <p className="text-muted fs-5">Discover jobs and connect with people across the platform.</p>
                
                <div className="mx-auto mt-4" style={{ maxWidth: '600px' }}>
                    <Form onSubmit={handleSearch} className="d-flex gap-2 p-1 bg-white rounded-pill shadow-sm border">
                        <Form.Control 
                            type="text" 
                            placeholder="Search people by name or username..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-0 bg-transparent py-2 px-4 focus-none"
                            style={{ boxShadow: 'none' }}
                        />
                        <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold">
                            Search
                        </Button>
                    </Form>
                </div>
            </div>

            {/* Quick Stats Row */}
            <Row className="g-4 mb-5">
                {key === 'jobs' ? (
                    <>
                        <Col md={6} lg={3}>
                            <StatCard title="Global Jobs" value={totalGlobalJobs} icon="briefcase" color="primary" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="Applied" value={appliedCount} icon="check-circle" color="success" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="New Today" value={newToday} icon="calendar-star" color="info" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="Companies" value={[...new Set(globalJobs.map(j => j.company))].length} icon="building" color="warning" />
                        </Col>
                    </>
                ) : (
                    <>
                        <Col md={6} lg={3}>
                            <StatCard title="Search Results" value={totalPeople} icon="people" color="primary" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="Global Jobs" value={totalGlobalJobs} icon="briefcase" color="success" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="Applied" value={appliedCount} icon="check-circle" color="info" />
                        </Col>
                        <Col md={6} lg={3}>
                            <StatCard title="New Today" value={newToday} icon="calendar-plus" color="warning" />
                        </Col>
                    </>
                )}
            </Row>

            <Tabs
                id="explore-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-5 custom-tabs justify-content-center border-0"
            >
                <Tab eventKey="jobs" title="Global Jobs">
                    <div className="mt-4">
                        {jobsLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-secondary">Loading global jobs...</p>
                            </div>
                        ) : globalJobs.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                                <div className="mb-4">
                                    <i className="bi bi-briefcase" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
                                </div>
                                <h3 className="fw-bold mb-2">No jobs available</h3>
                                <p className="text-secondary mb-0">Check back later for new opportunities!</p>
                            </div>
                        ) : (
                            <Row className="g-4">
                                {globalJobs.map(job => (
                                    <Col key={job.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                        <Card className="border-0 shadow-sm hover-shadow transition rounded-4 h-100">
                                            <Card.Body className="p-4 d-flex flex-column">
                                                {/* Company Logo */}
                                                <div className="d-flex align-items-center mb-3">
                                                    <div 
                                                        className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm me-3" 
                                                        style={{ 
                                                            width: '48px', 
                                                            height: '48px', 
                                                            fontSize: '1.2rem',
                                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                                        }}
                                                    >
                                                        {(job.company?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h6 className="fw-bold mb-0 text-truncate">{job.title}</h6>
                                                        <p className="text-primary fw-bold mb-0 small text-truncate">{job.company}</p>
                                                    </div>
                                                </div>

                                                {/* Location & Badges */}
                                                <div className="mb-3">
                                                    <p className="text-muted small mb-2">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        {job.location || 'Remote'}
                                                    </p>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {job.batchYear && job.batchYear !== 'All' && (
                                                            <Badge bg="warning" text="dark" className="rounded-pill px-2 py-1 small">
                                                                Batch: {job.batchYear}
                                                            </Badge>
                                                        )}
                                                        <Badge 
                                                            bg={job.jobType === 'Full-time' ? 'success' : job.jobType === 'Internship' ? 'info' : 'secondary'} 
                                                            className="rounded-pill px-2 py-1 small"
                                                        >
                                                            {job.jobType}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Posted By */}
                                                {job.postedBy && (
                                                    <p className="mb-2 small text-muted">
                                                        Posted by: <Link to={`/u/${job.postedBy.id}`} className="text-decoration-none fw-bold text-primary">@{job.postedBy.username}</Link>
                                                    </p>
                                                )}

                                                {/* Date */}
                                                <p className="text-muted small mb-3">
                                                    <i className="bi bi-calendar3 me-1"></i>
                                                    {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
                                                </p>

                                                {/* Buttons - Push to bottom */}
                                                <div className="mt-auto d-flex flex-column gap-2">
                                                    {appliedJobIds.includes(job.id) ? (
                                                        <Badge bg="success" className="px-3 py-2 rounded-pill text-center">
                                                            ✓ Applied
                                                        </Badge>
                                                    ) : (
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm" 
                                                            className="rounded-pill w-100"
                                                            onClick={() => handleMarkApplied(job.id)}
                                                        >
                                                            Mark Done
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        className="rounded-pill w-100"
                                                        href={job.jobUrl}
                                                        target="_blank"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Tab>
                <Tab eventKey="people" title="Search People">
                    <div className="mt-4">
                        {searchLoading && (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-secondary">Searching for people...</p>
                            </div>
                        )}
                        {searchError && <Alert variant="danger">{searchError}</Alert>}
                        {!searchLoading && !hasSearched && (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                                <div className="mb-4">
                                    <i className="bi bi-search" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
                                </div>
                                <h3 className="fw-bold mb-2">Search for people</h3>
                                <p className="text-secondary mb-0">Use the search bar above to find users by name or username</p>
                            </div>
                        )}
                        {!searchLoading && hasSearched && results.length === 0 && (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                                <div className="mb-4">
                                    <i className="bi bi-person-x" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
                                </div>
                                <h3 className="fw-bold mb-2">No users found</h3>
                                <p className="text-secondary mb-0">Try searching with a different name or username</p>
                            </div>
                        )}
                        <Row className="g-4">
                            {results.map(user => (
                                <Col key={user.id} xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <Card className="border-0 shadow-sm hover-shadow transition h-100">
                                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                                            <div 
                                                className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 text-white fw-bold shadow-sm"
                                                style={{ 
                                                    width: '50px', 
                                                    height: '50px', 
                                                    fontSize: '1.2rem',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                }}
                                            >
                                                {(user.fullName?.[0] || user.username?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden">
                                                <h6 className="fw-bold mb-0 text-truncate">{user.fullName || user.username}</h6>
                                                <p className="text-muted small mb-0 text-truncate">@{user.username}</p>
                                            </div>
                                            <Link to={`/u/${user.id}`} className="btn btn-outline-primary rounded-pill btn-sm px-3 fw-bold">
                                                Profile
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default SearchUsers;
