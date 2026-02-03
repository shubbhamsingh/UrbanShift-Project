import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle, FaCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa'; 

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import GoogleAuthButton from './GoogleAuthButton';

const Register = () => {
  const navigate = useNavigate();
  
  // 👇 SMART URL SETUP
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  // ✅ New States for OTP Flow
  const [step, setStep] = useState(1); // 1 = Form, 2 = OTP
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '', 
    user_type: 'BUYER',
    phone_number: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [criteria, setCriteria] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });

    setCriteria({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*]/.test(val)
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value });
  };

  // ✅ Google Sign-Up Success Handler
  const handleGoogleSuccess = (data) => {
    localStorage.setItem('token', data.access);
    localStorage.setItem('userType', data.user_type);
    localStorage.setItem('username', data.username);
    
    toast.success(`Welcome to UrbanShift, ${data.username}! 🎉`);
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

  // ✅ Google Sign-Up Error Handler
  const handleGoogleError = (error) => {
    toast.error(error || 'Google sign-up failed ❌');
  };

  // ✅ STEP 1: Register & Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
        toast.error("Passwords do not match! ❌");
        return;
    }

    if (!Object.values(criteria).every(v => v)) {
        toast.warning("Password format incorrect! 🔒");
        return;
    }

    setIsLoading(true);

    try {
      // Backend request to register and trigger OTP
      await axios.post(`${BACKEND_URL}/api/users/register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type,
        phone_number: formData.phone_number
      });
      
      toast.success("OTP Sent to your Email! 📧");
      
      // 👇✅ FIX: OTP Box ko khali kar rahe hain taaki purana OTP na dikhe
      setOtp(''); 
      
      setStep(2); // 👉 Ab yahan se OTP box dikhega

    } catch (error) {
      if (error.response && error.response.data) {
        const errorMsg = Object.values(error.response.data).flat().join(', ');
        toast.error(errorMsg);
      } else {
        toast.error("Registration Failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if(!otp) return toast.warning("Please enter OTP");
    
    setIsLoading(true);
    try {
        await axios.post(`${BACKEND_URL}/api/users/verify-email/`, {
            email: formData.email,
            otp: otp
        });

        toast.success("Email Verified! Registration Complete. 🎉");
        navigate('/login'); 
    } catch (error) {
        toast.error(error.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
        setIsLoading(false);
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
      <div style={formCardStyle}>
        
        {/* --- STEP 1: FORM --- */}
        {step === 1 && (
            <>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-primary)' }}>🚀 Join UrbanShift</h2>
                
                {/* ✅ Google Sign-Up Button */}
                <GoogleAuthButton 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  buttonText="Sign up with Google"
                />

                {/* Divider */}
                <div style={dividerStyle}>
                  <div style={dividerLineStyle}></div>
                  <span style={dividerTextStyle}>or register with email</span>
                  <div style={dividerLineStyle}></div>
                </div>
                
                <form onSubmit={handleSubmit}>
                
                <div style={inputGroup}>
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleChange} required style={inputStyle} placeholder="Choose a username" />
                </div>

                <div style={inputGroup}>
                    <label>Email Address</label>
                    <input type="email" name="email" onChange={handleChange} required style={inputStyle} placeholder="name@example.com" />
                </div>

                <div style={inputGroup}>
                    <label>Password</label>
                    <div style={{position: 'relative'}}>
                        <input 
                            type={showPass ? "text" : "password"} 
                            name="password" 
                            onChange={handlePasswordChange}
                            required 
                            style={inputStyle} 
                            placeholder="Create a strong password" 
                        />
                        <span onClick={() => setShowPass(!showPass)} style={eyeIconStyle}>
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {formData.password && (
                        <div style={{ marginTop: '8px', padding: '5px', background: 'rgba(0,0,0,0.2)', borderRadius: '5px' }}>
                            {renderStatus(criteria.length, "8+ chars")}
                            {renderStatus(criteria.upper, "Upper")}
                            {renderStatus(criteria.number, "Number")}
                            {renderStatus(criteria.special, "Special")}
                        </div>
                    )}
                </div>

                <div style={inputGroup}>
                    <label>Confirm Password</label>
                    <div style={{position: 'relative'}}>
                        <input 
                            type={showConfirmPass ? "text" : "password"} 
                            name="confirm_password" 
                            onChange={handleChange} 
                            required 
                            style={{
                                ...inputStyle, 
                                borderColor: formData.confirm_password 
                                    ? (formData.password === formData.confirm_password ? '#2ecc71' : '#e74c3c') 
                                    : 'var(--border-color)'
                            }} 
                            placeholder="Re-enter password" 
                        />
                        <span onClick={() => setShowConfirmPass(!showConfirmPass)} style={eyeIconStyle}>
                            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    
                    {formData.confirm_password && (
                        <div style={{ 
                            fontSize: '0.8rem', 
                            marginTop: '5px', 
                            color: formData.password === formData.confirm_password ? '#2ecc71' : '#e74c3c',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            {formData.password === formData.confirm_password 
                                ? <><FaCheckCircle /> Passwords Match</> 
                                : <><FaTimesCircle /> Passwords Do Not Match</>
                            }
                        </div>
                    )}
                </div>

                <div style={inputGroup}>
                    <label>I am a:</label>
                    <select name="user_type" onChange={handleChange} style={inputStyle}>
                    <option value="BUYER">👤 Normal User</option>
                    <option value="SELLER">🏡 Seller</option>
                    <option value="COMPANY">🚚 Mover & Packer</option>
                    </select>
                </div>

                {/* PHONE INPUT (UNCHANGED) */}
                <div style={inputGroup}>
                    <label>Mobile Number</label>
                    <PhoneInput
                        country={'in'}
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        enableSearch={true}
                        inputStyle={{
                            width: '100%',
                            height: '42px',
                            background: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px'
                        }}
                        buttonStyle={{
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRight: 'none',
                            borderRadius: '8px 0 0 8px'
                        }}
                        dropdownStyle={{
                            background: 'var(--card-bg)',
                            color: 'black'
                        }}
                    />
                </div>

                <button type="submit" style={btnStyle} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Create Account'}
                </button>
                
                <p style={{textAlign:'center', marginTop:'15px', color:'var(--text-secondary)'}}>
                    Already have an account? <Link to="/login" style={{color:'#3498db', fontWeight:'bold', textDecoration:'none', marginLeft:'5px'}}>Login here</Link>
                </p>
                </form>
            </>
        )}

        {/* --- STEP 2: OTP VERIFICATION --- */}
        {step === 2 && (
            <div style={{textAlign:'center'}}>
                <div style={{color: '#2ecc71', fontSize: '3rem', marginBottom: '10px'}}><FaCheckCircle /></div>
                <h2 style={{color: 'var(--text-primary)', marginBottom:'10px'}}>Verify Email</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom:'20px'}}>
                    Enter the OTP sent to <strong>{formData.email}</strong>
                </p>

                <form onSubmit={handleVerifyOtp}>
                    <input 
                        type="text" 
                        maxLength="6"
                        placeholder="123456" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                            ...inputStyle, 
                            textAlign:'center', 
                            fontSize:'1.5rem', 
                            letterSpacing:'5px',
                            marginBottom:'20px'
                        }}
                        required
                    />

                    <button type="submit" style={btnStyle} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                </form>

                <div style={{marginTop:'20px', display:'flex', justifyContent:'space-between', fontSize:'0.9rem'}}>
                    <span onClick={() => setStep(1)} style={{cursor:'pointer', color:'#888', display:'flex', alignItems:'center', gap:'5px'}}>
                        <FaArrowLeft /> Edit Email
                    </span>
                    {/* 👇 Resend Click karne par bhi purana OTP clear ho jayega */}
                    <span onClick={handleSubmit} style={{cursor:'pointer', color:'#3498db', fontWeight:'bold'}}>
                        Resend OTP
                    </span>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', padding: '20px' };
const formCardStyle = { width: '100%', maxWidth: '450px', padding: '30px', background: 'var(--card-bg)', borderRadius: '15px', border: '1px solid var(--border-color)' };
const inputGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--text-primary)' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', outline: 'none' };
const btnStyle = { width: '100%', padding: '12px', marginTop: '10px', background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const eyeIconStyle = { position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', color: '#888' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' };
const dividerLineStyle = { flex: 1, height: '1px', background: 'var(--border-color)' };
const dividerTextStyle = { color: 'var(--text-secondary)', fontSize: '0.85rem' };

export default Register;