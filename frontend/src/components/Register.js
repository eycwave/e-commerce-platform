import React, { useState } from 'react';
import axios from '../axiosConfig';
import {jwtDecode} from 'jwt-decode';

const Register = ({ onLoginClick }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [userUuid, setUserUuid] = useState('');
  const [error, setError] = useState('');

  const EMPTY_FIELD_ERROR = '*This field cannot be empty';

  const validateFields = () => {
    const newErrors = {};
    if (!firstname) newErrors.firstname = EMPTY_FIELD_ERROR;
    if (!lastname) newErrors.lastname = EMPTY_FIELD_ERROR;
    if (!age) newErrors.age = EMPTY_FIELD_ERROR;
    if (!department) newErrors.department = EMPTY_FIELD_ERROR;
    if (!email) newErrors.email = EMPTY_FIELD_ERROR;
    if (!password) newErrors.password = EMPTY_FIELD_ERROR;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post('/api/v1/auth/register', {
        firstname,
        lastname,
        age: Number(age),
        department,
        email,
        password,
      });

      setMessage('Registration successful!');

      // Decode token and initialize cart
      const token = response.data.token;
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      setUserUuid(decodedToken.userUuid);

      // Initialize the cart in the database
      await axios.post(`/api/carts/save/${decodedToken.userUuid}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTimeout(() => {
        onLoginClick();
      }, 850);
    } catch (error) {
      console.error('Error during registration:', error.response ? error.response.data : error.message);
      setMessage('Registration failed!');
      setFirstname('');
      setLastname('');
      setAge('');
      setDepartment('');
      setEmail('');
      setPassword('');
      setErrors({});
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <div className="form-field">
        {errors.firstname && <p className="error-message">{errors.firstname}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div className="form-field">
        {errors.lastname && <p className="error-message">{errors.lastname}</p>}
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div className="form-field">
        {errors.age && <p className="error-message">{errors.age}</p>}
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="form-field">
        {errors.department && <p className="error-message">{errors.department}</p>}
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div className="form-field">
        {errors.email && <p className="error-message">{errors.email}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-field">
        {errors.password && <p className="error-message">{errors.password}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleRegister}>Register</button>
      <p onClick={onLoginClick} className="switch-form">
        Already have an account? Login here.
      </p>
      {message && (
        <div className="message-container">
          <p className={`message ${message.includes('successful') ? 'success-message' : 'error-message'}`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Register;
