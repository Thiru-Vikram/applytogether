import React, { useState, useEffect } from "react";
import { Button, NavDropdown } from "react-bootstrap";
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
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate("/"); };

  const avatar = (user?.sub || user?.username || "?").charAt(0).toUpperCase();

  const NavLink = ({ to, label }) => {
    const active = location.pathname === to;
    const icon = NAV_ICONS[to];
    return (
      <Link
        to={to}
        className={`tuf-nav-link${active ? " tuf-nav-link-active" : ""}`}
      >
        {icon && <i className={`bi bi-${icon}`}></i>}
        {label}
      </Link>
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
      <nav className={`tuf-navbar${scrolled ? " tuf-navbar-scrolled" : ""}`}>
        {/* Logo */}
        <Link to="/" className="tuf-brand">
          <span className="tuf-brand-icon">
            <i className="bi bi-people-fill"></i>
          </span>
          ApplyTogether
        </Link>

        {/* Centre links — desktop only */}
        {user && (
          <div className="tuf-center-links">
            {userLinks.map((l) => (
              <NavLink key={l.to} to={l.to} label={l.label} />
            ))}
          </div>
        )}

        {/* Right actions */}
        <div className="tuf-right">
          {user ? (
            <NavDropdown
              title={
                <span className="tuf-avatar">{avatar}</span>
              }
              id="tuf-user-dropdown"
              align="end"
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
            <button
              className="tuf-cta-btn"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="tuf-hamburger d-lg-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <i className={`bi bi-${menuOpen ? "x-lg" : "list"}`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && user && (
        <div className="tuf-mobile-menu">
          {userLinks.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} />
          ))}
          <button
            className="tuf-mobile-logout"
            onClick={() => { handleLogout(); setMenuOpen(false); }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      )}

      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;
