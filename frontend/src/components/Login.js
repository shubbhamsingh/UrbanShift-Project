import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
// 👇 1. Toast Import Karein
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ⏳ Loading Start

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', formData);
      
      // Token Save karein
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('userType', response.data.user_type);
      localStorage.setItem('username', response.data.username);
      
      // ✅ 2. SUCCESS TOAST (Alert Hataya)
      toast.success(`Welcome back, ${response.data.username}! 👋`);
      
      // Thoda wait karke redirect, taaki popup dikhe
      setTimeout(() => {
          window.location.href = '/'; 
      }, 1500);
      
    } catch (error) {
      console.error("Login Error:", error);
      // ✅ 3. ERROR TOAST
      toast.error('Login Failed! Invalid Username or Password ❌');
    } finally {
      setIsLoading(false); // ✅ Loading Stop
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-primary)' }}>👋 Welcome Back</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}>Login to continue.</p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input type="text" name="username" placeholder="Enter username" onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" placeholder="Enter password" onChange={handleChange} style={inputStyle} required />
          </div>

          <button type="submit" style={{...buttonStyle, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}} disabled={isLoading}>
            {isLoading ? '⏳ Logging In...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
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

const cardStyle = {
  background: 'var(--card-bg)',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid var(--border-color)'
};

const inputGroupStyle = { marginBottom: '20px' };

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: 'var(--text-primary)'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px'
};

export default Login;