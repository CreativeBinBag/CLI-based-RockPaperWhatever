import React, { createContext, useState, useEffect } from 'react';
import api from './api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/users/check-auth-status', { withCredentials: true });
      setAuth({
        id: response.data.id,
        userName: response.data.userName,
        email: response.data.email,
        role: response.data.role,
      });
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setAuth(null);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Running checkAuthStatus on mount');
    checkAuthStatus();
  }, []);
  
  // if loading is true, wait until it's false before rendering the children
  if (loading) {
    console.log('Auth is still loading...');
    return null; 
  }
    
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/users/login', {
        userName: username,
        password,
      }, { withCredentials: true });


      if (response.status === 200) {
        setAuth(response.data);
      } else {
        console.error('Login failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/users/logout', {}, { withCredentials: true });
      setAuth(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const checkAdmin = () => auth && auth.role === 'admin';


  return (
    <AuthContext.Provider value={{ auth, loading, setAuth, login, logout, checkAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
  

export { AuthContext };