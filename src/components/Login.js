import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState(''); // Email field
  const [password, setPassword] = useState(''); // Password field
  const [error, setError] = useState(''); // Error message state
  const [loggedIn, setLoggedIn] = useState(false); // Logged in state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setLoggedIn(true);
    }
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        setLoggedIn(true);
        alert('Login successful!');
        navigate('/'); // Redirect to the home page
      } else {
        setError(data.error || 'Login failed. Please check your credentials.'); // Set error message
      }
    } catch (error) {
      setError('An error occurred. Please try again later.'); // Set error message for network errors
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setLoggedIn(false);
    alert('Logged out successfully!');
    navigate('/login'); // Redirect to login page
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setLoggedIn(false);
    navigate('/login'); // Redirect to login page
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown visibility
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(''); // Clear error on input change
  };

  return (
    <>
      <div className='box'>
        {loggedIn && (
          <div className="profile-menu">
            <p onClick={toggleDropdown} className="profile-button">Welcome, {localStorage.getItem('email')}!</p>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleSwitchAccount} className='bu'>Switch Account</button>
                <button onClick={handleLogout} className='bu'>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
      {!loggedIn && (
        <div className="login-container">
          <div className="login-form-wrapper">
            <h1 align="center" className='h1class'>Login</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email" // Use type="email" for better validation
                  id="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  required
                />
              </div>
              <button type="submit" className='bu'>Login</button>
            </form>
            <div className="signup-link">
              <p className='para'>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
