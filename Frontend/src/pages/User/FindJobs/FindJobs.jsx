import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
  Stack,
} from "react-bootstrap";
import { useJobs } from "../../../hooks/useJobs";
import { useApplications } from "../../../hooks/useApplications";
import JobCard from "../../../components/common/JobCard";
import { JobCardSkeleton } from "../../../components/common/Skeleton";

const PAGE_SIZE = 12;

const JOB_TYPE_OPTIONS = ["Internship", "Full-time", "Hackathon"];
const ELIGIBILITY_OPTIONS = ["2026", "2027", "2028", "2029", "2030"];
const POSTED_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "3days", label: "Last 3 days" },
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
];

const parseBatchYears = (batchYear) => {
  if (!batchYear) return [];
  return String(batchYear)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

const matchesPostedFilter = (postedDate, filterValue) => {
  if (!filterValue || !postedDate) return true;

  const jobDate = new Date(postedDate);
  if (Number.isNaN(jobDate.getTime())) return false;

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  switch (filterValue) {
    case "today":
      return now - jobDate <= dayMs;
    case "3days":
      return now - jobDate <= 3 * dayMs;
    case "7days":
      return now - jobDate <= 7 * dayMs;
    case "30days":
      return now - jobDate <= 30 * dayMs;
    default:
      return true;
  }
};

const FilterDropdown = ({
  title,
  activeCount = 0,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-top pt-3 mt-3">
      <button
        type="button"
        className="w-100 d-flex justify-content-between align-items-center bg-transparent border-0 p-0 text-start"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ cursor: "pointer" }}
        aria-expanded={isOpen}
      >
        <span
          className="fw-bold text-secondary text-uppercase d-flex align-items-center gap-2"
          style={{ fontSize: "0.78rem", letterSpacing: "0.04em" }}
        >
          {title}
          {activeCount > 0 && (
            <Badge
              bg="primary"
              pill
              className="px-2 py-1"
              style={{ fontSize: "0.68rem" }}
            >
              {activeCount}
            </Badge>
          )}
        </span>
        <i
          className={`bi bi-chevron-${isOpen ? "up" : "down"} text-secondary`}
          style={{ fontSize: "0.85rem", transition: "transform 0.2s" }}
        />
      </button>
      <Collapse in={isOpen}>
        <div>
          <Stack gap={2} className="pt-3">
            {children}
          </Stack>
        </div>
      </Collapse>
    </div>
  );
};

const FindJobs = () => {
  const [page, setPage] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedEligibilityYears, setSelectedEligibilityYears] = useState([]);
  const [postedFilter, setPostedFilter] = useState("");

  const {
    jobs,
    isLoading: jobsLoading,
    applyToJob,
  } = useJobs("all", { page: 0, size: 100 });

  const { appliedJobIds, isLoading: appsLoading } = useApplications();

  useEffect(() => {
    setPage(0);
  }, [
    searchKeywords,
    selectedJobTypes,
    selectedEligibilityYears,
    postedFilter,
  ]);

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearch = searchKeywords.trim().toLowerCase();
    const searchableText = [
      job?.title,
      job?.company,
      job?.description,
      job?.location,
      job?.jobType,
      job?.batchYear,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesKeywords =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    const matchesJobType =
      selectedJobTypes.length === 0 ||
      selectedJobTypes.some(
        (selectedType) =>
          String(job?.jobType ?? "").toLowerCase() ===
          selectedType.toLowerCase(),
      );

    const matchesEligibility =
      selectedEligibilityYears.length === 0 ||
      selectedEligibilityYears.some((year) =>
        parseBatchYears(job?.batchYear).includes(String(year)),
      );

    const matchesPosted = matchesPostedFilter(job?.postedDate, postedFilter);

    return (
      matchesKeywords && matchesJobType && matchesEligibility && matchesPosted
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const paginatedJobs = filteredJobs.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  const handleJobTypeChange = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  const handleEligibilityChange = (year) => {
    setSelectedEligibilityYears((prev) =>
      prev.includes(year)
        ? prev.filter((item) => item !== year)
        : [...prev, year],
    );
  };

  const handlePageChange = (newPage) => {
    const nextPage = Math.max(0, Math.min(newPage, totalPages - 1));
    setPage(nextPage);
    document
      .querySelector(".jobs-content-pane")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchKeywords("");
    setSelectedJobTypes([]);
    setSelectedEligibilityYears([]);
    setPostedFilter("");
    setPage(0);
  };

  const activeFiltersCount =
    selectedJobTypes.length +
    selectedEligibilityYears.length +
    (searchKeywords ? 1 : 0) +
    (postedFilter ? 1 : 0);

  const noJobsAtAll = !jobsLoading && !appsLoading && jobs.length === 0;
  const noJobsAfterFilter =
    !jobsLoading &&
    !appsLoading &&
    jobs.length > 0 &&
    filteredJobs.length === 0;

  return (
    <div className="jobs-page-wrapper">
      <Container fluid="xxl" className="h-100 py-3 py-lg-4">
        <Row className="h-100 g-4 align-items-stretch">
          <Col lg={4} xl={3} className="jobs-filter-pane pe-lg-2">
            <Card
              className="bg-white rounded-4 shadow-sm mb-3"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <h6
                  className="fw-bold text-secondary text-uppercase mb-0"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}
                >
                  Filters
                </h6>
                {activeFiltersCount > 0 ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="p-0 text-danger text-decoration-none fw-bold d-flex align-items-center gap-1"
                    onClick={clearAllFilters}
                  >
                    <i className="bi bi-x-circle-fill"></i> Clear
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="p-0 text-danger text-opacity-50 text-decoration-none fw-semibold d-flex align-items-center gap-1"
                    disabled
                  >
                    <i className="bi bi-x-circle"></i> Clear
                  </Button>
                )}
              </div>

              <InputGroup className="mt-3">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search jobs"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                />
              </InputGroup>

              <FilterDropdown
                title="Job Type"
                activeCount={selectedJobTypes.length}
                defaultOpen={true}
              >
                {JOB_TYPE_OPTIONS.map((type) => (
                  <Form.Check
                    key={type}
                    id={`job-type-${type}`}
                    type="checkbox"
                    label={type}
                    checked={selectedJobTypes.includes(type)}
                    onChange={() => handleJobTypeChange(type)}
                  />
                ))}
              </FilterDropdown>

              <FilterDropdown
                title="Eligibility"
                activeCount={selectedEligibilityYears.length}
                defaultOpen={true}
              >
                {ELIGIBILITY_OPTIONS.map((year) => (
                  <Form.Check
                    key={year}
                    id={`eligibility-${year}`}
                    type="checkbox"
                    label={year}
                    checked={selectedEligibilityYears.includes(year)}
                    onChange={() => handleEligibilityChange(year)}
                  />
                ))}
              </FilterDropdown>

              <FilterDropdown
                title="Posted"
                activeCount={postedFilter ? 1 : 0}
                defaultOpen={false}
              >
                {POSTED_OPTIONS.map(({ value, label }) => (
                  <Form.Check
                    key={value}
                    id={`posted-${value}`}
                    type="radio"
                    name="postedFilter"
                    label={label}
                    checked={postedFilter === value}
                    onChange={() => setPostedFilter(value)}
                  />
                ))}
              </FilterDropdown>

              {activeFiltersCount > 0 && (
                <p className="small text-secondary mb-0 mt-3">
                  {filteredJobs.length} matching jobs
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} xl={9} className="jobs-content-pane ps-lg-2 jobs-section">
          {jobsLoading || appsLoading ? (
            <Stack gap={3}>
              {[...Array(8)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </Stack>
          ) : noJobsAtAll || noJobsAfterFilter ? (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-4 mb-3">
                  <i className="bi bi-search h3 mb-0"></i>
                </div>
                <h3 className="fw-bold mb-2">No results</h3>
                <p className="text-secondary mb-4">
                  {noJobsAfterFilter
                    ? "Search again or try updating your filters"
                    : "No jobs available right now."}
                </p>
                {activeFiltersCount > 0 && (
                  <Button type="button" variant="outline-primary" onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Stack gap={3}>
              <Card
                className="bg-white rounded-4 overflow-hidden shadow-sm"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "44px", height: "44px", fontSize: "1.25rem" }}
                      >
                        <i className="bi bi-briefcase-fill"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 text-dark">
                          {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} available
                        </h5>
                        <p className="text-secondary small mb-0 mt-1">
                          {activeFiltersCount > 0
                            ? `Showing filtered results (${activeFiltersCount} active filter${
                                activeFiltersCount > 1 ? "s" : ""
                              })`
                            : "Showing all open opportunities"}
                        </p>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <span
                        className="px-3 py-1 rounded-pill small fw-bold d-flex align-items-center gap-1"
                        style={{
                          backgroundColor: "#eef2ff",
                          color: "#4f46e5",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        <i className="bi bi-funnel-fill"></i>
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>

              {paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobIds.includes(job.id)}
                  onApply={applyToJob}
                />
              ))}

              {filteredJobs.length > PAGE_SIZE && (
                <Card className="border-0 shadow-sm">
                  <Card.Body className="d-flex justify-content-center">
                    <Pagination className="m-0">
                      <Pagination.Prev
                        disabled={safePage === 0}
                        onClick={() => handlePageChange(safePage - 1)}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i}
                          active={i === safePage}
                          onClick={() => handlePageChange(i)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={safePage === totalPages - 1}
                        onClick={() => handlePageChange(safePage + 1)}
                      />
                    </Pagination>
                  </Card.Body>
                </Card>
              )}
            </Stack>
          )}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default FindJobs;
