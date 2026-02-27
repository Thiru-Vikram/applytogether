import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();

  console.log(
    "ProtectedRoute - user:",
    user,
    "adminOnly:",
    adminOnly,
    "staffOnly:",
    staffOnly,
  );

  if (loading) {
    return <div className="container mt-4 text-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    console.log("No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    // Redirect to home if admin role is required but not present
    console.log("Admin required but user role is:", user.role);
    return <Navigate to="/" replace />;
  }

  if (staffOnly && user.role !== "STAFF") {
    // Redirect to home if staff role is required but not present
    console.log("Staff required but user role is:", user.role);
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - rendering children");
  return children;
};

export default ProtectedRoute;
