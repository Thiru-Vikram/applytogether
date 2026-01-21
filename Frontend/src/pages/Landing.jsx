import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeWord, setActiveWord] = useState('Together');
  const [stats, setStats] = useState({ jobs: 0, users: 0, applied: 0 });

  useEffect(() => {
    // If logged in, redirect to appropriate home
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/jobs');
      }
    }
  }, [user, navigate]);
  const words = ['FASTER'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord(prev => {
        const currentIndex = words.indexOf(prev);
        return words[(currentIndex + 1) % words.length];
      });
    }, 2000);

    // Simple counter animation effect
    const timeout = setTimeout(() => {
      setStats({ jobs: 450, users: 1200, applied: 850 });
    }, 500);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="landing-v2 position-relative overflow-hidden" style={{ backgroundColor: '#fcfdfe' }}>
      {/* Background Orbs */}
      <div className="blob blob-1" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }}></div>
      <div className="blob blob-2" style={{ background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)' }}></div>

      {/* Hero Section */}
      <section className="hero-section min-vh-100 d-flex align-items-center py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7} className="text-center text-lg-start">
              <h1 className="display-1 fw-black mb-4 tracking-tight fade-in" style={{ color: '#0f172a', lineHeight: '1' }}>
                Landing Jobs <br />
                <span className="text-gradient">
                  {activeWord}
                </span>
              </h1>
              <p className="lead text-secondary mb-5 pe-lg-5 fade-in" style={{ fontSize: '1.2rem', animationDelay: '0.1s' }}>
                The ultimate companion for your job search. Track applications, discover 
                hand-picked roles, and stay ahead of the competition with community-driven insights.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start fade-in" style={{ animationDelay: '0.2s' }}>
                <Button as={Link} to="/register" variant="primary" className="btn-glow px-5 py-3 fw-bold rounded-3">
                  Start Your Journey
                </Button>
                <Button as={Link} to="/login" variant="light" className="px-5 py-3 fw-bold rounded-3 border bg-white shadow-sm">
                  Member Area
                </Button>
              </div>
            </Col>
            
            <Col lg={5} className="fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="hero-visual position-relative">
                <div className="glass-card p-4 rounded-4 shadow-xl border border-white">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                      <i className="bi bi-briefcase-fill text-primary h4 mb-0"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">System Architect</h6>
                      <small className="text-muted">Netflix • Palo Alto</small>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mb-4">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 border border-success border-opacity-10">Remote</span>
                    <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 border border-warning border-opacity-10">2025 Batch</span>
                  </div>
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                     <div className="d-flex justify-content-between mb-1">
                        <small className="fw-bold">Interview Prep</small>
                        <small className="text-primary">85%</small>
                     </div>
                     <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: '85%' }}></div>
                     </div>
                  </div>
                  <Button className="w-100 fw-bold py-2 rounded-3 shadow-sm btn-primary" disabled>Mark Applied</Button>
                </div>
                
                {/* Floating Elements */}
                <div className="floating-card position-absolute d-none d-md-flex align-items-center gap-2 bg-white p-2 px-3 rounded-pill shadow border" style={{ top: '-20px', left: '-30px' }}>
                  <span className="text-success">●</span> <small className="fw-bold">42 New Jobs</small>
                </div>
                <div className="floating-card position-absolute d-none d-md-flex align-items-center gap-2 bg-white p-2 px-3 rounded-pill shadow border" style={{ bottom: '40px', right: '-20px' }}>
                   <small className="fw-bold text-primary">✓ Applied</small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How it Works */}
      <section className="py-5 bg-white border-top border-bottom">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-black display-5 mb-3 tracking-tight">How it works</h2>
            <p className="text-secondary lead">Get hired in three simple steps</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={4} className="fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4 display-3 fw-black text-primary opacity-25">01</div>
              <h4 className="fw-bold mb-3">Create Profile</h4>
              <p className="text-secondary">Set up your professional identity and link your interests to stay organized.</p>
            </Col>
            <Col md={4} className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-4 display-3 fw-black text-primary opacity-25">02</div>
              <h4 className="fw-bold mb-3">Discover Jobs</h4>
              <p className="text-secondary">Browse high-quality opportunities hand-picked and shared by the community.</p>
            </Col>
            <Col md={4} className="fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="mb-4 display-3 fw-black text-primary opacity-25">03</div>
              <h4 className="fw-bold mb-3">Apply & Succeed</h4>
              <p className="text-secondary">Apply via verified links and track every stage of your progress visually.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white text-center position-relative overflow-hidden">
         <div className="position-absolute w-100 h-100 top-0 start-0 opacity-10" style={{ background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}></div>
         <Container className="py-5 position-relative">
            <h2 className="display-4 fw-black mb-4">Ready to land your next role?</h2>
            <p className="lead mb-5 opacity-75">Don't search harder, search smarter. Join ApplyTogether today.</p>
            <Button as={Link} to="/register" size="lg" variant="light" className="px-5 py-3 fw-bold text-primary shadow-lg border-0">
                Join Now Free
            </Button>
         </Container>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-white border-top text-center">
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded-2 text-white fw-bold">AT</div>
              <h3 className="fw-black mb-0 tracking-tight">ApplyTogether</h3>
          </div>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
            Built for students and professionals to share, track, and succeed together.
          </p>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <a href="#" className="text-muted text-decoration-none small hover-primary">Privacy</a>
            <a href="#" className="text-muted text-decoration-none small hover-primary">Terms</a>
            <a href="#" className="text-muted text-decoration-none small hover-primary">Contact</a>
          </div>
          <p className="text-muted small mb-0">© 2025 ApplyTogether. Crafted with ❤️ for the community.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Landing;
