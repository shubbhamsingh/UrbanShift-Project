import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import GoogleAuthButton from './GoogleAuthButton';

const Login = () => {
  const navigate = useNavigate();
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
      const response = await axios.post(`${BACKEND_URL}/api/users/login/`, formData);
      
      // Data Save karein
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('userType', response.data.user_type);
      localStorage.setItem('username', response.data.username);
      
      toast.success(`Welcome back, ${response.data.username}! 👋`);
      
      // ✅ SCROLL FIX: Login hote hi page ko upar bhejo
      window.scrollTo(0, 0);

      // ✅ ROLE BASED REDIRECT LOGIC
      const userType = response.data.user_type;

      setTimeout(() => {
          window.dispatchEvent(new Event("storage")); 
          
          if (userType === 'SELLER') {
              navigate('/seller-dashboard'); 
          } else if (userType === 'COMPANY') {
              navigate('/company-dashboard');
          } else {
              navigate('/');
          }
      }, 1000);
      
    } catch (error) {
      console.error("Login Error:", error);
      toast.error('Login Failed! Invalid Username or Password ❌');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Login Success Handler
  const handleGoogleSuccess = (data) => {
    localStorage.setItem('token', data.access);
    localStorage.setItem('userType', data.user_type);
    localStorage.setItem('username', data.username);
    
    toast.success(`Welcome, ${data.username}! 🎉`);
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
      
      if (data.user_type === 'SELLER') {
          navigate('/seller-dashboard');
      } else if (data.user_type === 'COMPANY') {
          navigate('/company-dashboard');
      } else {
          navigate('/');
      }
    }, 500);
  };

  // ✅ Google Login Error Handler
  const handleGoogleError = (error) => {
    toast.error(error || 'Google login failed ❌');
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-primary)' }}>👋 Welcome Back</h2>
        <p style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-secondary)' }}>Login to continue.</p>

        {/* ✅ Google Login Button */}
        <GoogleAuthButton 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          buttonText="Continue with Google"
        />

        {/* Divider */}
        <div style={dividerStyle}>
          <span style={dividerTextStyle}>or</span>
        </div>

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
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' };
const dividerTextStyle = { color: 'var(--text-secondary)', fontSize: '0.85rem', background: 'var(--card-bg)', padding: '0 10px', position: 'relative', zIndex: 1, flex: '0 0 auto' };

export default Login;