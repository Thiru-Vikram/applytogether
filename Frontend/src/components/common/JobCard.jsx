import React from 'react';
import { Card, Badge, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const JobCard = ({ job, isApplied, onApply }) => {
  return (
    <Col xs={12} sm={6} md={6} lg={4} xl={3}>
      <Card className="border-0 shadow-sm hover-shadow transition rounded-4 h-100">
        <Card.Body className="p-4 d-flex flex-column">
          {/* Company Info */}
          <div className="d-flex align-items-center mb-3">
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
              by: <Link to={`/u/${job.postedBy.id}`} className="text-decoration-none fw-bold text-primary">@{job.postedBy.username}</Link>
            </p>
          )}

          {/* Date */}
          <p className="text-muted small mb-3">
            <i className="bi bi-calendar3 me-1"></i>
            {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
          </p>

          {/* Buttons - Push to bottom */}
          <div className="mt-auto d-flex flex-column gap-2">
            {isApplied ? (
              <Badge bg="success" className="px-3 py-2 rounded-pill text-center">
                ✓ Applied
              </Badge>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-pill w-100"
                onClick={() => onApply(job.id)}
              >
                Apply Now
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
  );
};

export default JobCard;
