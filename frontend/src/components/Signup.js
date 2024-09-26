import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Signup = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  if (user) {
    navigate('/');
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send the signup request to the backend
      const response = await axios.post('/api/signup', { name, email, password });
      // Store the JWT token received after signup
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      // Redirect the user to a protected route (e.g., dashboard)
      navigate('/');
      
    } catch (err) {
        if (err.response && err.response.status == 400) {
            setError(err.response.data.message);
        } else {
            setError('Registration failed. Please try again.');
        }
        // elseif (err.response && err.response.data.errors) {
        //     setErrors(err.response.data.errors);
        //   } else {
        //     setErrors('Registration failed. Please try again.');
        //   }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
