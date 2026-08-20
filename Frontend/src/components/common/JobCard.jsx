import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const JobCard = ({ job, isApplied, onApply }) => {
  const summaryText = job?.description?.replace(/\s+/g, " ").trim() || "";
  const isGenericDescription =
    !summaryText || summaryText.toLowerCase() === "open opportunity";

  return (
    <Card
      className="bg-white rounded-4 overflow-hidden shadow-sm"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="flex-grow-1">
            <h5
              className="fw-semibold mb-2 text-dark"
              style={{ fontSize: "1.05rem" }}
            >
              {job?.title}
            </h5>

            <div className="d-flex flex-wrap align-items-center gap-2 small text-muted mb-2">
              {job?.company && (
                <span className="fw-bold text-primary">{job.company}</span>
              )}
              {job?.batchYear && (
                <Badge
                  bg="warning"
                  text="dark"
                  className="rounded-pill px-2 py-1 small"
                >
                  Batch: {job.batchYear}
                </Badge>
              )}
            </div>

            {(job?.location || job?.jobType) && (
              <div className="d-flex flex-wrap align-items-center gap-2 small text-muted mb-2">
                {job?.location && (
                  <span>
                    <i className="bi bi-geo-alt me-1"></i>
                    {job.location}
                  </span>
                )}
                {job?.jobType && (
                  <Badge
                    bg={
                      job.jobType === "Full-time"
                        ? "success"
                        : job.jobType === "Internship"
                          ? "info"
                          : "secondary"
                    }
                    className="rounded-pill px-2 py-1 small"
                  >
                    {job.jobType}
                  </Badge>
                )}
              </div>
            )}

            {!isGenericDescription && (
              <p
                className="mb-2 text-secondary small"
                style={{ lineHeight: 1.5 }}
              >
                {summaryText.length > 140
                  ? `${summaryText.slice(0, 140)}...`
                  : summaryText}
              </p>
            )}

            <p className="text-muted small mb-0">
              <i className="bi bi-calendar3 me-1"></i>
              {job?.postedDate
                ? new Date(job.postedDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {isApplied && (
            <Badge bg="success" className="rounded-pill px-2 py-1">
              Applied
            </Badge>
          )}
        </div>

        <div className="d-flex gap-2 mt-3" style={{ width: "fit-content" }}>
          {job?.jobUrl ? (
            <Button
              as="a"
              href={job.jobUrl}
              target="_blank"
              rel="noreferrer"
              variant="outline-primary"
              size="sm"
              className="rounded-pill fw-bold px-3"
              style={{ minWidth: "140px" }}
            >
              View Details
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill fw-bold px-3"
              disabled
              style={{ minWidth: "140px" }}
            >
              View Details
            </Button>
          )}

          <Button
            variant={isApplied ? "outline-success" : "primary"}
            size="sm"
            onClick={() => !isApplied && onApply?.(job?.id)}
            disabled={isApplied}
            className="rounded-pill fw-bold px-3"
            style={{ minWidth: "180px" }}
          >
            {isApplied ? "Applied" : "Mark Done"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default JobCard;
