import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Register on the platform and connect with your friends.",
    icon: "person-circle",
  },
  {
    num: "02",
    title: "Discover Jobs",
    desc: "Post jobs you have applied for and explore jobs shared by friends.",
    icon: "briefcase",
  },
  {
    num: "03",
    title: "Track Applications",
    desc: "Keep every job you have applied for organized in one place.",
    icon: "bar-chart-line",
  },
];

const Landing = () => {
  const [stats, setStats] = useState({ jobs: 0, users: 0, applied: 0 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStats({ jobs: 450, users: 1200, applied: 850 });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <section className="py-5 bg-white border-bottom">
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={7} className="text-center text-lg-start">
              <Badge bg="primary" className="rounded-pill px-3 py-2 mb-3">
                Career collaboration
              </Badge>
              <h1 className="display-2 fw-bold mb-4 text-dark">
                Find your next job with friends
              </h1>
              <p className="lead text-secondary mb-5 pe-lg-5">
                Stop searching through thousands of random portals.
                ApplyTogether brings you jobs recommended by people you trust.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="lg"
                  className="px-5 fw-bold"
                >
                  Start Your Journey
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="lg"
                  className="px-5 fw-bold"
                >
                  Login
                </Button>
              </div>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                      <i className="bi bi-briefcase-fill text-primary h4 mb-0"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">SDE Intern</h6>
                      <small className="text-muted">Netflix</small>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <Badge bg="success" className="rounded-pill px-3 py-2">
                      Full Time
                    </Badge>
                    <Badge
                      bg="warning"
                      text="dark"
                      className="rounded-pill px-3 py-2"
                    >
                      Batch 2026
                    </Badge>
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Interview Prep</small>
                      <small className="text-primary fw-bold">85%</small>
                    </div>
                    <ProgressBar now={85} />
                  </div>

                  <Button className="w-100 fw-bold py-2" disabled>
                    Apply Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-primary">{stats.jobs}+</h3>
                  <p className="text-secondary mb-0">Jobs shared</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-primary">{stats.users}+</h3>
                  <p className="text-secondary mb-0">Active users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-primary">{stats.applied}+</h3>
                  <p className="text-secondary mb-0">Applications tracked</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-white border-top border-bottom">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 mb-3">How it works</h2>
            <p className="text-secondary lead mb-0">
              Get hired in three simple steps
            </p>
          </div>

          <Row className="g-4 text-center">
            {steps.map((step) => (
              <Col md={4} key={step.num}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-4 mb-3">
                      <i className={`bi bi-${step.icon} h3 mb-0`}></i>
                    </div>
                    <br />
                    <Badge bg="primary" className="rounded-pill mb-3">
                      {step.num}
                    </Badge>
                    <h5 className="fw-bold mb-2">{step.title}</h5>
                    <p className="text-secondary small mb-0">{step.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-primary text-white text-center">
        <Container className="py-5">
          <h2 className="display-5 fw-bold mb-4">
            Ready to land your next role?
          </h2>
          <p className="lead mb-5 opacity-75">
            Do not search harder, search smarter. Join ApplyTogether today.
          </p>
          <Button
            as={Link}
            to="/register"
            size="lg"
            variant="light"
            className="px-5 py-3 fw-bold text-primary border-0"
          >
            Join Now Free
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Landing;
