import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://urbanshift-project.onrender.com/api/users/login/', formData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      alert('Login Successful!');
      
      if (res.data.user_type === 'SELLER') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-primary)', fontSize: '2rem' }}>🔐 Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Enter your username" 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>

          <button type="submit" style={buttonStyle}>Login Securely</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          New here? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const pageContainerStyle = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-color)',
  padding: '20px'
};

// ✅ Card Style Contrast Improved (Same as Register)
const cardStyle = {
  background: 'var(--card-bg)',
  padding: '50px',
  borderRadius: '20px',
  // Zyaada gehri aur faili hui shadow
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
  width: '100%',
  maxWidth: '450px',
  border: '1px solid var(--border-color)',
  transition: 'transform 0.3s ease'
};

const inputGroupStyle = { marginBottom: '20px' };

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  fontSize: '0.9rem'
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s'
};

const buttonStyle = {
  width: '100%',
  padding: '15px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 10px 20px rgba(118, 75, 162, 0.3)'
};

export default Login;