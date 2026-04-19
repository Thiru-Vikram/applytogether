import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FindJobs from "./pages/FindJobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import AddAdmin from "./pages/AddAdmin";
import ProtectedRoute from "./ProtectedRoute";
import Landing from "./pages/Landing";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import SearchUsers from "./pages/SearchUsers";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import JobModeration from "./pages/JobModeration";
import AdminReports from "./pages/AdminReports";
import StaffPanel from "./pages/StaffPanel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const pingBackend = () => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace("/api", "");
  fetch(`${backendUrl}/actuator/health`).catch(() => {});
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="app-layout">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <FindJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute adminOnly={true}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AddAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute adminOnly={true}>
                  <JobModeration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/reports"
              element={
                <ProtectedRoute staffOnly={true}>
                  <StaffPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/tasks"
              element={
                <ProtectedRoute staffOnly={true}>
                  <StaffPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/u/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchUsers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
