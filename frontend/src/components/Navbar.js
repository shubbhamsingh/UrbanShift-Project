import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaLaptop, FaUserCircle } from 'react-icons/fa';

// ✅ 1. Aapka Logo Import kiya (src folder se)
import logo from '../logo.png'; 

// ✅ 2. Theme Context Correct Import
import { ThemeContext } from '../context/ThemeContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  
  // ✅ Context Data
  const { mode, cycleTheme } = useContext(ThemeContext);
  
  // Dark Mode Logic
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        navigate('/login');
    }
  };

  // --- STYLES ---
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    background: isDark ? '#121212' : '#ffffff',
    boxShadow: isDark ? '0 4px 10px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: '0.3s',
    borderBottom: isDark ? '1px solid #333' : 'none'
  };

  const logoContainer = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px' // Image aur Text ke beech gap
  };

  // 🔹 LOGO TEXT STYLE (Urban White/Black, Shift Orange)
  const logoText = {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: isDark ? '#ffffff' : '#2c3e50',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center'
  };

  const linkStyle = {
    color: isDark ? '#cccccc' : '#555555',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: '0.2s',
    cursor: 'pointer'
  };

  const btnStyle = {
    padding: '10px 22px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: '0.3s'
  };

  const postBtnStyle = {
    ...btnStyle,
    background: '#e67e22',
    color: 'white',
  };

  const logoutBtnStyle = {
    ...btnStyle,
    background: 'transparent',
    border: `1px solid ${isDark ? '#e74c3c' : '#c0392b'}`,
    color: isDark ? '#e74c3c' : '#c0392b'
  };

  const themeIconStyle = {
    cursor: 'pointer',
    color: isDark ? '#f1c40f' : '#f39c12',
    fontSize: '1.2rem',
    padding: '8px',
    borderRadius: '50%',
    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  // Icon Helper
  const getThemeIcon = () => {
      if (mode === 'light') return <FaSun title="Light Mode" />;
      if (mode === 'dark') return <FaMoon title="Dark Mode" />;
      return <FaLaptop title="System Mode" />;
  };

  return (
    <nav style={navStyle}>
      {/* ✅ LOGO SECTION (Image + Styled Text) */}
      <Link to="/" style={logoContainer}>
        {/* Aapka Logo Image */}
        <img src={logo} alt="UrbanShift Logo" style={{ height: '40px', width: 'auto' }} />
        
        {/* Aapka Styled Text */}
        <span style={logoText}>
            Urban<span style={{ color: '#e67e22' }}>Shift</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        
        {/* Theme Toggle */}
        <div onClick={cycleTheme} style={themeIconStyle}>
            {getThemeIcon()}
        </div>

        <Link to="/" style={linkStyle}>Home</Link>
        
        {token ? (
            <>
                <Link to={userType === 'SELLER' ? "/seller-dashboard" : "/user-dashboard"} style={linkStyle}>
                    Dashboard
                </Link>

                <Link to="/properties" style={linkStyle}>Find Homes</Link>

                <Link to="/add-property" style={postBtnStyle}>
                    + Post Property
                </Link>

                <Link to="/profile" style={{color: isDark ? '#fff':'#333', fontSize:'1.6rem'}}>
                    <FaUserCircle />
                </Link>

                <button onClick={handleLogout} style={logoutBtnStyle}>
                    Logout
                </button>
            </>
        ) : (
            <>
                <Link to="/properties" style={linkStyle}>Properties</Link>
                <Link to="/login" style={{...btnStyle, background: '#3498db', color:'white'}}>Login</Link>
                <Link to="/register" style={{...btnStyle, background: '#2ecc71', color:'white'}}>Register</Link>
            </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;