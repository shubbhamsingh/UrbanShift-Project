import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya (better redirection)
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); 

  // 👇 SMART URL SETUP (Automatic Detection)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Uses Dynamic URL
      const response = await axios.post(`${BACKEND_URL}/api/users/login/`, formData);
      
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('userType', response.data.user_type);
      localStorage.setItem('username', response.data.username);
      
      toast.success(`Welcome back, ${response.data.username}! 👋`);
      
      // Thoda delay taaki toast dikhe, phir redirect
      setTimeout(() => {
          // window.location.href ki jagah navigate use kar rahe hain (faster)
          navigate('/');
          window.location.reload(); // State refresh karne ke liye reload zaroori hai
      }, 1000);
      
    } catch (error) {
      console.error("Login Error:", error);
      toast.error('Login Failed! Invalid Username or Password ❌');
    } finally {
      setIsLoading(false);
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
            <div style={{ position: 'relative' }}>
                <input 
                    type={showPass ? "text" : "password"} 
                    name="password" 
                    placeholder="Enter password" 
                    onChange={handleChange} 
                    style={inputStyle} 
                    required 
                />
                <span onClick={() => setShowPass(!showPass)} style={eyeIconStyle}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#ff7e5f', textDecoration: 'none' }}>
                Forgot Password?
            </Link>
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
const pageContainerStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '20px' };
const cardStyle = { background: 'var(--card-bg)', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)' };
const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' };
const buttonStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const eyeIconStyle = { position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', color: '#888', fontSize: '1.1rem' };

export default Login;