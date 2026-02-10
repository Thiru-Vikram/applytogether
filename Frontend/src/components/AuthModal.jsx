import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AuthModal = ({ show, onHide }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    gender: "",
    passingYear: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.post("/auth/login", {
          username: formData.username,
          password: formData.password,
        });
        login(response.data);
        onHide();

        // Navigate based on role
        if (response.data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/jobs");
        }
      } else {
        // Register
        await api.post("/auth/register", {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          gender: formData.gender,
          passingYear: formData.passingYear,
        });

        // Auto login after registration
        const loginResponse = await api.post("/auth/login", {
          username: formData.username,
          password: formData.password,
        });
        login(loginResponse.data);
        onHide();
        navigate("/jobs");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isLogin
            ? "Login failed. Please check your credentials."
            : "Registration failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      username: "",
      password: "",
      email: "",
      fullName: "",
      gender: "",
      passingYear: "",
    });
  };

  const handleClose = () => {
    setIsLogin(true);
    setError("");
    setFormData({
      username: "",
      password: "",
      email: "",
      fullName: "",
      gender: "",
      passingYear: "",
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-3">
          {isLogin ? "Welcome Back!" : "Join ApplyTogether"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-secondary mb-4">
          {isLogin
            ? "Login to discover jobs shared by your friends"
            : "Create an account and start your journey"}
        </p>

        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          {/* Registration-only fields */}
          {!isLogin && (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="py-2"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Passing Year</Form.Label>
                <Form.Control
                  type="text"
                  name="passingYear"
                  placeholder="e.g., 2024"
                  value={formData.passingYear}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>
            </>
          )}

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="py-2"
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-bold rounded-pill"
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </Button>
        </Form>

        {/* Toggle between Login/Register */}
        <div className="text-center mt-4">
          <p className="text-secondary mb-0">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="btn btn-link p-0 text-primary fw-bold text-decoration-none"
              type="button"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
