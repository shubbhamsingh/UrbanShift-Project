import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 👇 Phone Input Library Imports
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// 👇 Toast Import (Popup ke liye)
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  
  // ✅ Loading State
  const [isLoading, setIsLoading] = useState(false);
   
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'BUYER',
    phone: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED handleSubmit FUNCTION IS HERE 👇
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Phone Validation (Toast Error)
    if (!formData.phone || formData.phone.length < 10) {
        toast.error("Please enter a valid phone number 📱");
        return;
    }

    setIsLoading(true); // ⏳ Loading shuru

    try {
      // Phone input library "+" nahi deti, isliye manually add kar rahe hain
      const dataToSend = { ...formData, phone: `+${formData.phone}` };
      
      await axios.post('http://127.0.0.1:8000/api/users/register/', dataToSend);
      
      // ✅ SUCCESS POPUP (Alert hataya, Toast lagaya)
      toast.success('Registration Successful! Please Login 🎉');
      
      // Thoda wait karke redirect karein taaki user popup dekh sake
      setTimeout(() => {
          navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      // ✅ ERROR POPUP
      toast.error('Registration Failed! (Check username or email) ❌');
    } finally {
      setIsLoading(false); // ✅ Loading khatam
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-primary)', fontSize: '2rem' }}>🚀 Join UrbanShift</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-secondary)' }}>Start your property journey today.</p>

        <form onSubmit={handleSubmit}>
           
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input type="text" name="username" placeholder="Choose a username" onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" placeholder="Create a strong password" onChange={handleChange} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>I am a:</label>
            <div style={{position: 'relative'}}>
                <select name="user_type" onChange={handleChange} style={dropdownStyle}>
                <option value="BUYER">👤 Normal User (Looking for House)</option>
                <option value="SELLER">🏠 Property Owner (Want to Sell/Rent)</option>
                <option value="COMPANY">🚚 Mover & Packer Company</option>
                </select>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Mobile Number</label>
            {/* ✅ Smart Phone Input with Flags & Search */}
            <PhoneInput
              country={'in'} // Default India
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone: phone })}
              inputStyle={{
                width: '100%',
                height: '45px',
                fontSize: '1rem',
                paddingLeft: '48px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-primary)'
              }}
              buttonStyle={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px 0 0 8px',
                backgroundColor: 'var(--bg-color)'
              }}
              dropdownStyle={{
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)' // ✅ Fixed text color for Dark Mode
              }}
              enableSearch={true}
              searchPlaceholder="Search country..."
            />
          </div>

          <button type="submit" style={{...buttonStyle, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}} disabled={isLoading}>
            {isLoading ? '⏳ Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
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
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
  width: '100%',
  maxWidth: '500px',
  border: '1px solid var(--border-color)',
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
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none',
  boxShadow: '0 0 0px 1000px var(--bg-color) inset', 
  WebkitTextFillColor: 'var(--text-primary)',
  caretColor: 'var(--text-primary)', 
};

const dropdownStyle = {
  ...inputStyle, 
  cursor: 'pointer', 
  appearance: 'none', 
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 15px center',
  backgroundSize: '15px',
  paddingRight: '40px'
};

const buttonStyle = {
  width: '100%',
  padding: '15px',
  background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  marginTop: '10px',
  boxShadow: '0 10px 20px rgba(255, 94, 98, 0.3)'
};

export default Register;