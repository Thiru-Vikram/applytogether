import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container mt-4 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  if (staffOnly && user.role !== "STAFF") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
