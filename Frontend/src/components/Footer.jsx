import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="site-footer border-top">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={6} md={12}>
            <h4 className="site-footer-brand mb-3">ApplyTogether</h4>
            <p className="site-footer-copy mb-3">
              © 2026 ApplyTogether. Precision in career collaboration.
              <br />
              Building the tools for the next generation of builders.
            </p>
            <div className="site-footer-icons d-flex gap-3">
              <a href="#" aria-label="Global" className="site-footer-icon-link">
                <i className="bi bi-globe2"></i>
              </a>
              <a
                href="#"
                aria-label="Community"
                className="site-footer-icon-link"
              >
                <i className="bi bi-bezier2"></i>
              </a>
              <a
                href="mailto:support@applytogether.app"
                aria-label="Email"
                className="site-footer-icon-link"
              >
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="site-footer-heading mb-3">PLATFORM</h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="site-footer-link">
                Blog
              </a>
              <a href="/jobs" className="site-footer-link">
                Jobs
              </a>
              <a href="#" className="site-footer-link">
                Help Center
              </a>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="site-footer-heading mb-3">LEGAL</h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="site-footer-link">
                Privacy Policy
              </a>
              <a href="#" className="site-footer-link">
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
