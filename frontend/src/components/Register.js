import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  // ✅ FIX: Clean Array Definition
  const countryCodes = [
    { code: '+91', name: 'IN', flag: '🇮🇳' },
    { code: '+1',  name: 'US', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+971',name: 'UAE', flag: '🇦🇪' },
    { code: '+81', name: 'JP', flag: '🇯🇵' },
  ];

  const [countryCode, setCountryCode] = useState('+91');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullMobile = `${countryCode} ${formData.phone}`;
    const dataToSend = { ...formData, phone: fullMobile };

    try {
      await axios.post('https://urbanshift-project.onrender.com/api/users/register/', dataToSend);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      alert('Registration Failed (Username might be taken)');
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
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* ✅ FIX 2: Correct Dropdown Display (Only Flag + Code) */}
                <select 
                    style={{ ...dropdownStyle, width: '130px', padding: '10px' }} 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                >
                    {countryCodes.map((item) => (
                        <option key={item.name} value={item.code}>
                           {/* Sirf Flag aur Code dikhaya hai */}
                           {item.flag} {item.code} 
                        </option>
                    ))}
                </select>

                <input 
                    type="number" 
                    name="phone" 
                    placeholder="Enter number" 
                    onChange={handleChange} 
                    style={{ ...inputStyle, flex: 1 }} 
                    required 
                />
            </div>
          </div>

          <button type="submit" style={buttonStyle}>Create Account</button>
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
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 10px 20px rgba(255, 94, 98, 0.3)'
};

export default Register;