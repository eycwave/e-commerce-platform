import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Order from './Orders';
import './App.css';

const App = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<Order />} />
      <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home if no match */}
    </Routes>
  );
};

export default App;
