import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Order from './Orders';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import BroadcastOrders from './BroadcastOrders';
import {jwtDecode} from 'jwt-decode';
import './App.css';

const App = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setIsAdmin(decodedToken.role === 'ADMIN');
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset admin status if needed
    window.location.reload(); // Refresh the page to reset the state
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        {isRegistered ? (
          <Login
            onRegisterClick={() => setIsRegistered(false)}
            onSuccess={() => setIsLoggedIn(true)}
          />
        ) : (
          <Register onLoginClick={() => setIsRegistered(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      {location.pathname !== '/login' && <Navbar isAdmin={isAdmin} onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/broadcast-orders" element={<BroadcastOrders />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
