import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle, FaCircle, FaTimesCircle } from 'react-icons/fa'; 

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

const Register = () => {
  const navigate = useNavigate();
  
  // 👇 SMART URL SETUP (Automatic Detection)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

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

    try {
      // ✅ Uses Dynamic URL
      await axios.post(`${BACKEND_URL}/api/users/register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type: formData.user_type,
        phone_number: formData.phone_number
      });
      
      toast.success("Registration Successful! 🎉");
      navigate('/login');

    } catch (error) {
      if (error.response && error.response.data) {
        const errorMsg = Object.values(error.response.data).flat().join(', ');
        toast.error(errorMsg);
      } else {
        toast.error("Registration Failed.");
      }
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-primary)' }}>🚀 Join UrbanShift</h2>
        
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

          {/* PHONE INPUT */}
          <div style={inputGroup}>
            <label>Mobile Number</label>
            <PhoneInput
              country={'in'}
              value={formData.phone_number}
              onChange={handlePhoneChange}
              enableSearch={true}
            />
          </div>

          <button type="submit" style={btnStyle}>Create Account</button>
          
          <p style={{textAlign:'center', marginTop:'15px', color:'var(--text-secondary)'}}>
              Already have an account? <Link to="/login" style={{color:'#3498db', fontWeight:'bold', textDecoration:'none', marginLeft:'5px'}}>Login here</Link>
          </p>
        </form>
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

export default Register;