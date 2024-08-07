import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Products from './Products';
import './App.css';

const App = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Products />;
  }

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
};

export default App;
