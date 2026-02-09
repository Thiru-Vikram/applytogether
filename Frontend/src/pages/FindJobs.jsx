import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import api from '../api/axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  // Filter States
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedBatchYear, setSelectedBatchYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/feed'),
          api.get('/applications/my-applications')
        ]);
        setJobs(jobsRes.data);
        setFilteredJobs(jobsRes.data);
        setAppliedJobIds(appsRes.data.map(app => app.job.id));
      } catch (err) {
        // If feed fails (e.g. 404 if empty), might handle gracefully but here we just show empty
        setError(null);
        setJobs([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = jobs;

    // Filter by keywords (title or company)
    if (searchKeywords) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchKeywords.toLowerCase()) ||
        job.company.toLowerCase().includes(searchKeywords.toLowerCase())
      );
    }

    // Filter by batch year
    if (selectedBatchYear) {
      result = result.filter(job => {
        if (!job.batchYear || job.batchYear.toLowerCase() === 'all') return true;
        // Parse list of years: "2024, 2025" -> ["2024", "2025"]
        const eligibleYears = job.batchYear.split(',').map(y => y.trim());
        return eligibleYears.includes(selectedBatchYear);
      });
    }

    // Filter by location (assuming job has a location field, if not, we skip or add it later)
    if (searchLocation) {
      result = result.filter(job => 
        job.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        (searchLocation.toLowerCase() === 'remote' && job.location?.toLowerCase().includes('remote'))
      );
    }

    // Filter by job type
    if (selectedJobTypes.length > 0) {
      result = result.filter(job => selectedJobTypes.includes(job.jobType));
    }

    // Filter by selected date
    if (selectedDate) {
      result = result.filter(job => {
        if (!job.postedDate) return false;
        const jobDate = parseISO(job.postedDate);
        return isSameDay(jobDate, selectedDate);
      });
    }

    setFilteredJobs(result);
  }, [searchKeywords, searchLocation, selectedJobTypes, selectedDate, selectedBatchYear, jobs]);

  const handleJobTypeChange = (type) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleMarkApplied = async (jobId) => {
    try {
      await api.post(`/applications/apply/${jobId}`);
      setAppliedJobIds(prev => [...prev, jobId]);
    } catch (err) {
      console.error('Failed to mark as applied', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading jobs...</p>
      </Container>
    );
  }

  // Calculate quick stats
  const totalJobs = jobs.length;
  const appliedCount = appliedJobIds.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = jobs.filter(j => j.postedDate && new Date(j.postedDate) > oneWeekAgo).length;
  const activeFiltersCount = selectedJobTypes.length + (selectedDate ? 1 : 0) + (searchKeywords ? 1 : 0) + (selectedBatchYear ? 1 : 0);

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
    <Container fluid className="fade-in py-5 px-lg-5">
      {/* Search Header */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold mb-2 text-center">Home</h1>
        <p className="text-center text-muted mb-4 fs-5">Stay updated with job posts from your network.</p>
        <div className="search-wrapper mx-auto" style={{ maxWidth: '900px' }}>
          <div className="search-input-group">
            <i className="bi bi-search text-secondary"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search jobs by title or company..." 
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <StatCard title="Jobs in Feed" value={totalJobs} icon="briefcase" color="primary" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Applied" value={appliedCount} icon="check-circle" color="success" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="New This Week" value={newThisWeek} icon="calendar-plus" color="info" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard title="Active Filters" value={activeFiltersCount} icon="funnel" color="warning" />
        </Col>
      </Row>

      {/* Sticky Filter Bar */}
      <div className="sticky-filter-bar d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center text-secondary fw-bold bg-white px-3 py-2 rounded-3 border">
                <i className="bi bi-funnel-fill me-2 text-primary"></i>
                <span>Filters</span>
            </div>
            
            <div className="d-flex gap-2 flex-wrap">
                {['Full-time', 'Internship', 'Hackathon'].map(type => (
                    <Button 
                        key={type}
                        variant={selectedJobTypes.includes(type) ? 'primary' : 'light'}
                        size="sm"
                        className={`rounded-pill px-3 fw-bold ${!selectedJobTypes.includes(type) ? 'bg-white border' : ''}`}
                        onClick={() => handleJobTypeChange(type)}
                    >
                        {type}
                    </Button>
                ))}
            </div>


        </div>

        <div className="d-flex align-items-center gap-2">
             <span className="text-secondary small fw-bold">{filteredJobs.length} Jobs Found</span>
             {activeFiltersCount > 0 && (
                <Button variant="link" size="sm" className="text-danger text-decoration-none fw-bold" onClick={() => {
                    setSearchKeywords('');
                    setSelectedJobTypes([]);
                    setSelectedDate(null);
                    setSelectedBatchYear('');
                }}>
                    Clear
                </Button>
             )}
        </div>
      </div>

      {/* Main Job Feed */}
      <Row className="g-4 justify-content-center">
            {error && <Col xs={12}><Alert variant="danger">{error}</Alert></Col>}
            
            {filteredJobs.length === 0 ? (
                  <Col xs={12}>
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                      <div className="mb-4">
                        <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
                      </div>
                      <h3 className="fw-bold mb-2">No jobs found</h3>
                      <p className="text-secondary mb-4">
                        {activeFiltersCount > 0 
                          ? "Try adjusting your filters to see more results" 
                          : "No jobs available in your feed right now. Check back later!"}
                      </p>
                    </div>
                  </Col>
                ) : (
                  filteredJobs.map((job) => (
                    <Col key={job.id} xs={12}>
                      <Card className="job-card-modern p-2">
                        <Card.Body>
                          <Row className="align-items-center g-3">

                            <Col>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="job-title-large mb-0">{job.title}</h5>
                                    {/* Action Buttons Desktop */}
                                    <div className="d-none d-md-flex gap-2">
                                        {appliedJobIds.includes(job.id) ? (
                                            <Badge bg="success" className="d-flex align-items-center px-3 py-2 rounded-pill">
                                                <i className="bi bi-check-circle me-2"></i> Applied
                                            </Badge>
                                        ) : (
                                            <Button variant="primary" size="sm" className="rounded-pill px-4" href={job.jobUrl} target="_blank">
                                                Apply Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center flex-wrap gap-3 mb-2">
                                    <span className="fw-bold text-dark">{job.company}</span>
                                    <span className="text-secondary small">•</span>
                                    <span className="text-secondary small">
                                        <i className="bi bi-geo-alt me-1"></i>{job.location || 'Remote'}
                                    </span>
                                    <span className="text-secondary small">•</span>
                                    <Badge bg="light" text="dark" className="border fw-normal">
                                        {job.jobType}
                                    </Badge>
                                    {job.batchYear && job.batchYear !== 'All' && (
                                        <Badge bg="light" text="dark" className="border fw-normal">
                                            {job.batchYear}
                                        </Badge>
                                    )}
                                </div>

                                <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: '0.85rem' }}>
                                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                                    {job.postedBy && (
                                        <>
                                            <span>•</span>
                                            <span>by @{job.postedBy.username}</span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Mobile Actions */}
                                <div className="d-flex d-md-none gap-2 mt-3">
                                    <Button variant="primary" size="sm" className="w-100 rounded-pill" href={job.jobUrl} target="_blank">
                                        Apply
                                    </Button>
                                </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
      </Row>
    </Container>
  );
};

export default FindJobs;
