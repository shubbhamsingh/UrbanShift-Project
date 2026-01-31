import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { FaEye, FaEyeSlash, FaCheckCircle, FaCircle, FaTimesCircle } from 'react-icons/fa';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Email passed from ForgotPassword page
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Toggle States
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Password Validation Criteria
    const [criteria, setCriteria] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false
    });

    useEffect(() => {
        if(location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    // Handle Password Change & Real-time Validation
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);

        setCriteria({
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            lower: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Check if all criteria are met
        if (!Object.values(criteria).every(Boolean)) {
           toast.error("Password must meet all security requirements.");
           return;
        }

        const BACKEND_URL = window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";
        setLoading(true);

        try {
            await axios.post(`${BACKEND_URL}/api/users/reset-password-confirm/`, {
                email: email,
                otp: otp,
                password: password
            });
            
            toast.success("Password Reset Successful! Login now. 🎉");
            navigate('/login');
            
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Invalid OTP or Failed to reset.");
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (isValid, text) => (
        <span style={{ 
            color: isValid ? '#2ecc71' : '#666', 
            fontSize: '0.75rem', 
            marginRight: '12px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px'
        }}>
          {isValid ? <FaCheckCircle /> : <FaCircle style={{fontSize: '0.5rem'}} />} {text}
        </span>
    );

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{color:'var(--text-primary)', textAlign:'center'}}>🔒 Set New Password</h2>
                <p style={{textAlign:'center', color:'#666', fontSize:'0.9rem'}}>
                    OTP sent to: <strong>{email || "..."}</strong>
                </p>
                
                <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                    
                    {/* Show Email Input ONLY if not passed from previous page */}
                    {!location.state?.email && (
                        <div style={{marginBottom:'15px'}}>
                            <label style={labelStyle}>Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    )}

                    <div style={{marginBottom:'15px'}}>
                        <label style={labelStyle}>Enter OTP</label>
                        <input 
                            type="text" 
                            placeholder="6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            required
                            style={{...inputStyle, letterSpacing: '2px', fontSize: '1.1rem'}}
                        />
                    </div>

                    <div style={{marginBottom:'15px'}}>
                        <label style={labelStyle}>New Password</label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type={showPass ? "text" : "password"} 
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                style={inputStyle}
                                placeholder="Min 8 chars, 1 Upper, 1 Special"
                            />
                            <span 
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '12px',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        {/* Password Strength Checklist */}
                        <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px' }}>
                            {renderStatus(criteria.length, "8+ Chars")}
                            {renderStatus(criteria.upper, "Upper (A-Z)")}
                            {renderStatus(criteria.lower, "Lower (a-z)")}
                            {renderStatus(criteria.number, "Number (0-9)")}
                            {renderStatus(criteria.special, "Special (@#$%)")}
                        </div>
                    </div>

                    <div style={{marginBottom:'20px'}}>
                        <label style={labelStyle}>Confirm New Password</label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type={showConfirmPass ? "text" : "password"} 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    ...inputStyle,
                                    borderColor: confirmPassword && (password !== confirmPassword) ? '#e74c3c' : 'var(--border-color)'
                                }}
                            />
                            <span 
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '12px',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <div style={{fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px'}}>
                                <FaTimesCircle /> Passwords do not match
                            </div>
                        )}
                    </div>
                    
                    <button type="submit" disabled={loading} style={btnStyle}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles (Reused from auth pages)
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', padding: '20px' };
const cardStyle = { width: '100%', maxWidth: '400px', background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' };
const labelStyle = { color:'var(--text-primary)', fontWeight:'bold', display:'block', marginBottom:'5px' };
const btnStyle = { width: '100%', padding: '12px', background: 'var(--accent-teal)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' };

export default ResetPassword;
