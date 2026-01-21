import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, label, adminOnly = false }) => {
    if (adminOnly && user?.role !== 'ADMIN') return null;
    
    const isActive = location.pathname === to;

    if (isActive) {
      return (
        <Button as={Link} to={to} variant="primary" className="fw-bold px-4 shadow-sm">
          {label}
        </Button>
      );
    }

    return (
      <Nav.Link as={Link} to={to} className="text-secondary fw-medium px-3">
        {label}
      </Nav.Link>
    );
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" className="border-bottom py-3 shadow-sm sticky-top">
      <Container>
        <BootstrapNavbar.Brand 
          as={Link} 
          to={!user ? "/" : (user.role === 'ADMIN' ? "/admin/dashboard" : "/jobs")} 
          className="fw-bold fs-3 text-primary transition-transform hover-scale"
        >
          ApplyTogether
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <>
                {user.role === 'ADMIN' ? (
                  <>
                    <NavItem to="/admin/dashboard" label="Dashboard" adminOnly={true} />
                    <NavItem to="/admin/users" label="Users" adminOnly={true} />
                    <NavItem to="/admin/jobs" label="Jobs" adminOnly={true} />
                    <NavItem to="/add-admin" label="Add Admin" adminOnly={true} />
                  </>
                ) : (
                  <>
                    <NavItem to="/jobs" label="Home" />
                    <NavItem to="/search" label="Explore" />
                    <NavItem to="/applications" label="Applications" />
                    <NavItem to={`/u/${user.userId}`} label="My Profile" />
                  </>
                )}
                
                <NavDropdown 
                    title={
                        <div className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle shadow-sm" style={{width: '40px', height: '40px'}}>
                             {(user.sub || user.username || '?').charAt(0).toUpperCase()}
                        </div>
                    } 
                    id="user-nav-dropdown" 
                    align="end"
                    className="ms-3"
                >
                    <NavDropdown.Header>{user.username}</NavDropdown.Header>
                    {/* <NavDropdown.Item as={Link} to={`/u/${user.userId}`}>My Profile</NavDropdown.Item> */}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
