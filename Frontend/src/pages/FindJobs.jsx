import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination } from 'react-bootstrap';
import { useJobs } from '../hooks/useJobs';
import { useApplications } from '../hooks/useApplications';
import JobCard from '../components/common/JobCard';
import { JobCardSkeleton } from '../components/common/Skeleton';
import StatCard from '../components/common/StatCard';

const FindJobs = () => {
  const [page, setPage] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState('');

  // Use custom hooks
  const { 
    jobs, 
    pagination, 
    isLoading: jobsLoading, 
    applyToJob 
  } = useJobs('feed', { 
    page, 
    size: 12 
  });

  const { appliedJobIds, isLoading: appsLoading } = useApplications();

  // Local filtering for things not handled by backend pagination yet (keywords, etc.)
  // Ideally these should also be backend search params, but let's keep current logic 
  // until we update backend to support full search in one endpoint.
  const filteredJobs = jobs.filter(job => {
    const matchesKeywords = !searchKeywords || 
      job.title.toLowerCase().includes(searchKeywords.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeywords.toLowerCase());
    
    const matchesType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType);
    
    const matchesBatch = !selectedBatchYear || (job.batchYear?.includes(selectedBatchYear));

    return matchesKeywords && matchesType && matchesBatch;
  });

  const handleJobTypeChange = (type) => {
    setSelectedJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const activeFiltersCount = selectedJobTypes.length + (searchKeywords ? 1 : 0) + (selectedBatchYear ? 1 : 0);

  return (
    <Container className="py-5">
      {/* Search Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">Home</h1>
        <p className="text-muted fs-6">Stay updated with job posts from your network.</p>
        
        <div className="mx-auto mt-4" style={{ maxWidth: '600px' }}>
          <Form className="d-flex gap-2 p-1 bg-white rounded-pill shadow-sm border" onSubmit={(e) => e.preventDefault()}>
            <Form.Control 
              type="text" 
              placeholder="Search jobs in this page..." 
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              className="border-0 bg-transparent py-2 px-4 focus-none"
              style={{ boxShadow: 'none' }}
            />
            <Button variant="primary" className="rounded-pill px-4 fw-bold">
              Search
            </Button>
          </Form>
        </div>
      </div>

      {/* Quick Stats Row */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={4}>
          <StatCard title="Jobs Available" value={pagination.totalElements} icon="briefcase" color="primary" />
        </Col>
        <Col md={6} lg={4}>
          <StatCard title="My Applications" value={appliedJobIds.length} icon="check-circle" color="success" />
        </Col>
        <Col md={12} lg={4}>
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
             <span className="text-secondary small fw-bold">{filteredJobs.length} Jobs on this page</span>
             {activeFiltersCount > 0 && (
                <Button variant="link" size="sm" className="text-danger text-decoration-none fw-bold" onClick={() => {
                    setSearchKeywords('');
                    setSelectedJobTypes([]);
                    setSelectedBatchYear('');
                    setPage(0);
                }}>
                    Clear
                </Button>
             )}
        </div>
      </div>

      {/* Main Job Feed */}
      <div className="mt-4">
        {jobsLoading || appsLoading ? (
          <Row className="g-4">
            {[...Array(8)].map((_, i) => <JobCardSkeleton key={i} />)}
          </Row>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
            <div className="mb-4">
              <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
            </div>
            <h3 className="fw-bold mb-2">No jobs found</h3>
            <p className="text-secondary mb-4">
              {activeFiltersCount > 0 
                ? "Try adjusting your filters or go to a different page" 
                : "No jobs available in your feed right now."}
            </p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  isApplied={appliedJobIds.includes(job.id)}
                  onApply={applyToJob}
                />
              ))}
            </Row>

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.Prev disabled={pagination.isFirst} onClick={() => handlePageChange(page - 1)} />
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next disabled={pagination.isLast} onClick={() => handlePageChange(page + 1)} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default FindJobs;
