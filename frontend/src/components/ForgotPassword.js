import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // ⚠️ Note: Actual email sending ke liye Backend me SMTP setup chahiye.
    // Abhi hum User Experience ke liye frontend ready kar rahe hain.
    
    if(email) {
        toast.success(`Reset link sent to ${email} (Simulation) 📨`);
        // Future me yahan axios.post call aayega
    } else {
        toast.error("Please enter a valid email!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{color:'var(--text-primary)', textAlign:'center'}}>🔑 Forgot Password?</h2>
        <p style={{color:'var(--text-secondary)', textAlign:'center', marginBottom:'20px'}}>
            Enter your email address and we'll send you a link to reset your password.
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
            
            <button type="submit" style={btnStyle}>Send Reset Link</button>
            
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