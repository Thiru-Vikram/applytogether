import React, { useState } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar as BootstrapNavbar,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const NAV_ICONS = {
  "/jobs":         "house",
  "/search":       "compass",
  "/applications": "file-earmark-check",
  "/admin/dashboard": "speedometer2",
  "/admin/users":  "people",
  "/admin/jobs":   "briefcase",
  "/admin/reports":"flag",
  "/add-admin":    "person-plus",
  "/staff/tasks":  "list-check",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const avatar = (user?.sub || user?.username || "?").charAt(0).toUpperCase();

  const NavLink = ({ to, label }) => {
    const active = location.pathname === to;
    const icon = NAV_ICONS[to];
    return (
      <Nav.Link
        as={Link}
        to={to}
        active={active}
        className="d-flex align-items-center gap-2 fw-medium"
      >
        {icon && <i className={`bi bi-${icon}`}></i>}
        {label}
      </Nav.Link>
    );
  };

  const userLinks =
    !user ? [] :
    user.role === "ADMIN" ? [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/users",     label: "Users" },
      { to: "/admin/jobs",      label: "Jobs" },
      { to: "/admin/reports",   label: "Reports" },
      { to: "/add-admin",       label: "Add Admin" },
    ] :
    user.role === "STAFF" ? [
      { to: "/staff/tasks", label: "My Tasks" },
    ] : [
      { to: "/jobs",          label: "Home" },
      { to: "/search",        label: "Explore" },
      { to: "/applications",  label: "Applications" },
      { to: `/u/${user.userId}`, label: "My Profile" },
    ];

  return (
    <>
      <BootstrapNavbar
        expand="lg"
        sticky="top"
        bg="white"
        className="border-bottom shadow-sm py-3"
      >
        <Container>
          <BootstrapNavbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2 fw-bold text-primary"
          >
            <span className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-2 lh-1">
              <i className="bi bi-people-fill"></i>
            </span>
            ApplyTogether
          </BootstrapNavbar.Brand>

          {user && <BootstrapNavbar.Toggle aria-controls="main-navbar" />}

          <BootstrapNavbar.Collapse id="main-navbar">
            {user && (
              <Nav className="mx-auto gap-lg-2 my-3 my-lg-0">
                {userLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} label={l.label} />
                ))}
              </Nav>
            )}
          </BootstrapNavbar.Collapse>

          <div className="d-flex align-items-center gap-2 ms-auto">
          {user ? (
            <NavDropdown
              title={
                <span
                  className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold shadow-sm"
                  style={{ width: "38px", height: "38px", minWidth: "38px" }}
                >
                  {avatar}
                </span>
              }
              id="user-dropdown"
              align="end"
              className="d-flex align-items-center"
            >
              <NavDropdown.Header className="fw-bold">
                {user.username}
              </NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger fw-medium">
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Button
              variant="primary"
              className="rounded-pill px-4 fw-bold"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </Button>
          )}
          </div>
        </Container>
      </BootstrapNavbar>

      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;
