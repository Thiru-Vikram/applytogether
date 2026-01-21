import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import FindJobs from './pages/FindJobs';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import AddAdmin from './pages/AddAdmin';
import ProtectedRoute from './ProtectedRoute';
import Landing from './pages/Landing';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import SearchUsers from './pages/SearchUsers';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import JobModeration from './pages/JobModeration';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <FindJobs />
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post-job" element={
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/add-admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AddAdmin />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute adminOnly={true}>
                  <JobModeration />
                </ProtectedRoute>
              } />
              
              <Route path="/u/:userId" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchUsers />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
