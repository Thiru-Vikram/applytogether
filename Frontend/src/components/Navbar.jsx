import React, { useState, useEffect } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItem = ({ to, label, adminOnly = false }) => {
    if (adminOnly && user?.role !== "ADMIN") return null;

    const isActive = location.pathname === to;

    if (isActive) {
      return (
        <Button
          as={Link}
          to={to}
          variant="primary"
          className="fw-bold px-4 shadow-sm"
        >
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
    <BootstrapNavbar
      bg="white"
      expand="lg"
      className={`border-bottom py-3 sticky-top navbar-custom ${
        isScrolled
          ? isLandingPage
            ? "navbar-floating-landing"
            : "navbar-floating"
          : ""
      }`}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to={
            !user ? "/" : user.role === "ADMIN" ? "/admin/dashboard" : "/jobs"
          }
          className="fw-bold fs-3 text-primary transition-transform hover-scale"
        >
          ApplyTogether
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <>
                {user.role === "ADMIN" ? (
                  <>
                    <NavItem
                      to="/admin/dashboard"
                      label="Dashboard"
                      adminOnly={true}
                    />
                    <NavItem to="/admin/users" label="Users" adminOnly={true} />
                    <NavItem to="/admin/jobs" label="Jobs" adminOnly={true} />
                    <NavItem
                      to="/add-admin"
                      label="Add Admin"
                      adminOnly={true}
                    />
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
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle shadow-sm"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {(user.sub || user.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  }
                  id="user-nav-dropdown"
                  align="end"
                  className="ms-3"
                >
                  <NavDropdown.Header>{user.username}</NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>

                {/* Get Started Button */}
                <Button
                  variant="primary"
                  onClick={() => setShowAuthModal(true)}
                  className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </BootstrapNavbar>
  );
};

export default Navbar;
