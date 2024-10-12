import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setupAxiosInterceptors } from '../axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const login = async (name, password) => {
    try {
      const response = await axios.post('/auth/login', {
        fullname: name,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        console.log('Logged in successfully!');
        console.log(response);
        localStorage.setItem('accessToken', response.data.accessToken);
        const authTokens = {
          accessToken: localStorage.getItem('accessToken'),
        };
        
        setupAxiosInterceptors(authTokens);
        setIsAuthenticated(true);
        useCallback();
        
      } else {
        console.log('Failed to login: ', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);