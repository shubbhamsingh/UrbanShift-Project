import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { mode, cycleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  // Auth Data
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const userType = localStorage.getItem('userType'); 

  // 👇 Smart URL for Admin Link
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const ADMIN_URL = isLocal 
    ? "http://127.0.0.1:8000/admin" 
    : "https://urbanshift-project.onrender.com/admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload(); 
  };

  const getThemeIcon = () => {
    if (mode === 'light') return '☀️';
    if (mode === 'dark') return '🌙';
    return '🖥️';
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar-container">
      
      {/* BRANDING */}
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        <img src={logo} alt="Logo" className="brand-logo" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="brand-title">
                Urban<span style={{ color: 'var(--accent-orange)' }}>Shift</span>
            </h1>
        </div>
      </Link>

      {/* --- 📱 MOBILE RIGHT SIDE (Theme Btn + Hamburger) --- */}
      <div className="mobile-actions">
        {/* Mobile Theme Button */}
        <button 
            onClick={cycleTheme} 
            className="theme-btn mobile-theme-btn"
            title={`Current Mode: ${mode.toUpperCase()}`}
        >
            {getThemeIcon()}
        </button>

        {/* Hamburger Icon */}
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
        </div>
      </div>

      {/* --- LINKS MENU --- */}
      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        
        {/* Desktop Theme Button */}
        <button 
          onClick={cycleTheme} 
          className="theme-btn desktop-theme-btn"
          title={`Current Mode: ${mode.toUpperCase()}`}
        >
            {getThemeIcon()}
        </button>

        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>

        {/* --- BUYER LINKS --- */}
        {userType === 'BUYER' && (
            <>
                <Link to="/properties" className="nav-link" onClick={closeMenu}>Find Homes</Link>
                <Link to="/wishlist" className="nav-link" onClick={closeMenu} style={{color: 'var(--accent-orange)'}}>
                    DreamHome🏠
                </Link>
                <Link to="/packers" className="nav-link" onClick={closeMenu}>Movers</Link>
                <Link to="/my-moves" className="nav-link" onClick={closeMenu}>My Bookings</Link>
            </>
        )}

        {/* --- SELLER LINKS --- */}
        {userType === 'SELLER' && (
            <>
                <Link to="/seller-dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                <Link to="/add-property" className="btn-3d-orange" onClick={closeMenu}>Post Property</Link>
            </>
        )}

        {/* --- COMPANY LINKS --- */}
        {userType === 'COMPANY' && (
            <>
                 <Link to="/company-dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                 <Link to="/company-requests" className="nav-link" onClick={closeMenu}>Requests</Link>
            </>
        )}

        {/* --- ⚙️ ADMIN LINK (Fixed for Shubham_Singh) --- */}
        {(userType === 'ADMIN' || username === 'Shubham_Singh' || username === 'admin') && (
            <a 
                href={ADMIN_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link" 
                onClick={closeMenu}
                style={{color: '#ff4d4d', fontWeight: 'bold'}}
            >
                ⚙️ Admin Panel
            </a>
        )}

        {/* AUTH BUTTONS */}
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexDirection: 'inherit' }}>
            <span style={{ fontWeight: '600', color: 'var(--accent-teal)', fontSize: '14px' }}>Hi, {username}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexDirection: 'inherit' }}>
            <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="btn-3d-orange" onClick={closeMenu}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;