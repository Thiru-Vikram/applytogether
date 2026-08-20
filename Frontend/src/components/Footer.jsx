import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light border-top py-5 mt-0">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={6} md={12}>
            <h4 className="fw-bold text-dark mb-3">ApplyTogether</h4>
            <p className="text-secondary mb-3">
              © 2026 ApplyTogether. Precision in career collaboration.
              <br />
              Building the tools for the next generation of builders.
            </p>
            <div className="d-flex gap-3">
              <a href="#" aria-label="Global" className="text-secondary">
                <i className="bi bi-globe2"></i>
              </a>
              <a
                href="#"
                aria-label="Community"
                className="text-secondary"
              >
                <i className="bi bi-bezier2"></i>
              </a>
              <a
                href="mailto:support@applytogether.app"
                aria-label="Email"
                className="text-secondary"
              >
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="fw-bold small text-uppercase text-dark mb-3">
              Platform
            </h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-secondary text-decoration-none">
                Blog
              </a>
              <a href="/jobs" className="text-secondary text-decoration-none">
                Jobs
              </a>
              <a href="#" className="text-secondary text-decoration-none">
                Help Center
              </a>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="fw-bold small text-uppercase text-dark mb-3">
              Legal
            </h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-secondary text-decoration-none">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary text-decoration-none">
                Terms of Service
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
