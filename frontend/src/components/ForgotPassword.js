import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 👇 Real API Integration
    const BACKEND_URL = window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

    if(email) {
        toast.info("Sending OTP... ⏳");
        
        try {
            await axios.post(`${BACKEND_URL}/api/users/forgot-password/`, { email });
            toast.success(`OTP sent to ${email} 📨`);
            
            // Redirect to Reset Password Page with Email
            navigate('/reset-password', { state: { email: email } });
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to send OTP. Try again.");
        }
    } else {
        toast.error("Please enter a valid email!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{color:'var(--text-primary)', textAlign:'center'}}>🔑 Reset Password</h2>
        <p style={{color:'var(--text-secondary)', textAlign:'center', marginBottom:'20px'}}>
            Enter your email address and we'll send you a <b>6-digit OTP</b> to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
                <label style={{color:'var(--text-primary)', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Email Address</label>
                <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
            </div>
            
            <button type="submit" style={btnStyle}>Send OTP</button>
            
            <div style={{textAlign:'center', marginTop:'20px'}}>
                <Link to="/login" style={{color:'#aaa', textDecoration:'none'}}>← Back to Login</Link>
            </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', padding: '20px' };
const cardStyle = { width: '100%', maxWidth: '400px', background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' };
const btnStyle = { width: '100%', padding: '12px', background: 'var(--accent-teal)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' };

export default ForgotPassword;