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

      <Row className="g-4">
        {/* Filter Sidebar */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="glass-sidebar shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-funnel me-2"></i>Filters
              </h6>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="link" 
                  size="sm"
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    setSearchKeywords('');
                    setSelectedJobTypes([]);
                    setSelectedDate(null);
                    setSelectedBatchYear('');
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Clear All
                </Button>
              )}
            </div>
            
            <div className="mb-4">
              <h6 className="filter-section-title">
                <i className="bi bi-briefcase"></i> Job Type
              </h6>
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                <Form.Check 
                  key={type}
                  type="checkbox"
                  id={`type-${type}`}
                  label={type}
                  className="mb-2"
                  checked={selectedJobTypes.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                />
              ))}
            </div>

            <div className="mb-4">
              <h6 className="filter-section-title mt-4">
                <i className="bi bi-calendar-event"></i> Job Calendar
              </h6>
              <div className="calendar-container bg-white rounded-3 p-2 shadow-sm border">
                <Calendar 
                  onChange={setSelectedDate} 
                  value={selectedDate}
                  tileContent={({ date, view }) => {
                    if (view === 'month') {
                      const hasJobs = jobs.some(job => 
                        job.postedDate && isSameDay(parseISO(job.postedDate), date)
                      );
                      return hasJobs ? <span className="dot-indicator"></span> : null;
                    }
                  }}
                />
              </div>
              {selectedDate && (
                <Button 
                  variant="link" 
                  className="p-0 mt-2 text-decoration-none text-sm"
                  onClick={() => setSelectedDate(null)}
                >
                  <i className="bi bi-x-circle me-1"></i> Clear date filter
                </Button>
              )}
            </div>
          </div>
        </Col>

        {/* Job List */}
        <Col lg={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
                My Feed
            </h5>
          </div>

          <Row className="g-4">
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
                      {activeFiltersCount > 0 && (
                        <Button 
                          variant="primary" 
                          className="rounded-pill px-4"
                          onClick={() => {
                            setSearchKeywords('');
                            setSearchLocation('');
                            setSelectedJobTypes([]);
                            setSelectedDate(null);
                            setSelectedBatchYear('');
                          }}
                        >
                          <i className="bi bi-arrow-counterclockwise me-2"></i>Clear all filters
                        </Button>
                      )}
                    </div>
                  </Col>
                ) : (
                  filteredJobs.map((job) => (
                    <Col key={job.id} xs={12}>
                      <Card className="border-0 shadow-sm hover-shadow transition rounded-4" style={{ overflow: 'hidden' }}>
                        <Card.Body className="p-4">
                          <Row className="align-items-center">
                            <Col xs="auto">
                              <div 
                                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold shadow-sm" 
                                style={{ 
                                  width: '56px', 
                                  height: '56px', 
                                  fontSize: '1.5rem',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                              >
                                {job.company.charAt(0).toUpperCase()}
                              </div>
                            </Col>
                            <Col>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h5 className="fw-bold mb-1">{job.title}</h5>
                                  <p className="text-secondary mb-1">
                                    <span className="text-primary fw-bold">{job.company}</span>
                                    <span className="mx-2">•</span>
                                    <span>{job.location || 'Remote'}</span>
                                  </p>
                                  {job.postedBy && (
                                    <p className="mb-0 small">
                                      Posted by: <Link to={`/u/${job.postedBy.id}`} className="text-decoration-none fw-bold text-primary">@{job.postedBy.username}</Link>
                                    </p>
                                  )}
                                </div>
                                <div className="d-flex gap-2 flex-wrap justify-content-end">
                                    {job.batchYear && job.batchYear !== 'All' && (
                                        <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">
                                            Batch: {job.batchYear}
                                        </Badge>
                                    )}
                                    <Badge 
                                      bg={job.jobType === 'Full-time' ? 'success' : job.jobType === 'Internship' ? 'info' : 'secondary'} 
                                      className="rounded-pill px-3 py-2"
                                    >
                                        {job.jobType}
                                    </Badge>
                                </div>
                              </div>
                              
                              <div className="mt-3 d-flex align-items-center gap-3">
                                <small className="text-secondary">
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {new Date(job.postedDate).toLocaleDateString('en-GB')}
                                </small>
                                <small className="text-secondary text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '0.7rem' }}>
                                  <i className="bi bi-mortarboard me-1"></i>
                                  {job.batchYear || 'All Batches'}
                                </small>
                                <div className="ms-auto d-flex gap-2">
                                  {appliedJobIds.includes(job.id) ? (
                                    <Badge bg="success" className="d-flex align-items-center px-3 rounded-pill">
                                      <i className="bi bi-check-circle me-2"></i> Applied
                                    </Badge>
                                  ) : (
                                    <>
                                      <Button 
                                        variant="outline-primary" 
                                        className="rounded-pill px-4"
                                        href={job.jobUrl}
                                        target="_blank"
                                      >
                                        Apply Now
                                      </Button>
                                      <Button 
                                        variant="primary" 
                                        className="rounded-pill px-4 shadow-sm"
                                        onClick={() => handleMarkApplied(job.id)}
                                      >
                                        Mark as Done
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
          </Row>

        </Col>
      </Row>
    </Container>
  );
};

export default FindJobs;
