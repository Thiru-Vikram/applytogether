import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (token) {
      setUser({ username, role, userId, sub: username });
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userId', userData.userId);
    setUser({ username: userData.username, role: userData.role, userId: userData.userId, sub: userData.username });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <div className="d-flex justify-content-center align-items-center vh-100">Loading Auth...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
