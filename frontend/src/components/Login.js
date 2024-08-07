import React, { useState } from 'react';
import axios from '../axiosConfig';

const Login = ({ onRegisterClick, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setMessage('');

    try {
      const response = await axios.post('/api/v1/auth/login', {email,password,});
      localStorage.setItem('token', response.data.token);
      setTimeout(() => {
        onSuccess();
      }, 0);
    } catch (error) {
      console.error(error);
      setMessage('Invalid email address or password.');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <div className="form-field">
        {emailError && (
          <p className="email-error-message">{emailError}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message && (
        <div className="message-container">
          <p className="error-message">{message}</p>
        </div>
      )}
      <button onClick={handleLogin}>Login</button>
      <p onClick={onRegisterClick} className="switch-form">
        Don't have an account? Register here.
      </p>
    </div>
  );
};

export default Login;
