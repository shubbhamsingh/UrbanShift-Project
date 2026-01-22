import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { mode, cycleTheme } = useContext(ThemeContext);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userType = userInfo ? userInfo.user_type : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload(); 
  };

  const getThemeIcon = () => {
    if (mode === 'light') return '☀️';
    if (mode === 'dark') return '🌙';
    return '🖥️';
  };

  return (
    <nav style={{...navContainerStyle, backgroundColor: 'var(--navbar-bg)', boxShadow: 'var(--navbar-shadow)'}}>
      
      {/* BRANDING */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={logo} alt="Logo" style={{ height: '45px', width: 'auto' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{...brandTitleStyle, color: 'var(--text-primary)'}}>
                Urban<span style={{ color: 'var(--accent-orange)' }}>Shift</span>
            </h1>
        </div>
      </Link>

      {/* LINKS + THEME TOGGLE */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        
        {/* THEME BUTTON */}
        <button 
          onClick={cycleTheme} 
          style={themeBtnStyle} 
          title={`Current Mode: ${mode.toUpperCase()}`}
        >
            {getThemeIcon()}
        </button>

        <Link to="/" style={linkStyle}>Home</Link>

        {/* --- ✅ USER LINKS (DreamHome Added) --- */}
        {userType === 'USER' && (
            <>
                <Link to="/properties" style={linkStyle}>Find Homes</Link>
                
                {/* ✨ NEW DREAM HOME LINK ✨ */}
                <Link to="/wishlist" style={{...linkStyle, color: 'var(--accent-orange)'}}>
                    DreamHome🏠
                </Link>

                <Link to="/packers" style={linkStyle}>Movers</Link>
            </>
        )}

        {/* --- SELLER LINKS --- */}
        {userType === 'SELLER' && (
            <>
                <Link to="/seller-dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/add-property" className="btn-3d-orange">Post Property</Link>
            </>
        )}

        {/* --- COMPANY LINKS --- */}
        {userType === 'COMPANY' && (
            <>
                 <Link to="/company-dashboard" style={linkStyle}>Dashboard</Link>
                 <Link to="/company-requests" style={linkStyle}>Requests</Link>
            </>
        )}

        {userType === 'ADMIN' && <Link to="/admin-dashboard" style={linkStyle}>Admin</Link>}

        {/* AUTH BUTTONS */}
        {userInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: '600', color: 'var(--accent-teal)', fontSize: '14px' }}>Hi, {userInfo.username}</span>
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" className="btn-3d-orange">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// --- STYLES ---
const navContainerStyle = {
    padding: '12px 40px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 1000,
    transition: 'background-color 0.3s'
};

const brandTitleStyle = { margin: 0, fontSize: '24px', fontWeight: '800', lineHeight: '1' };

const linkStyle = {
    textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', transition: '0.3s'
};

const themeBtnStyle = {
    background: 'var(--bg-color)', 
    color: 'var(--text-primary)',
    border: '1px solid var(--text-secondary)', 
    cursor: 'pointer', 
    fontSize: '1.2rem', 
    padding: '6px 10px',
    borderRadius: '20px',
    transition: 'all 0.3s'
};

const logoutBtnStyle = {
    padding: '6px 14px', background: 'transparent', color: '#dc3545',
    border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
};

export default Navbar;