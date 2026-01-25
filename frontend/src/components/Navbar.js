import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';
import { FaSearch, FaUserCircle, FaThLarge } from 'react-icons/fa'; // Icons Import kiye

const Navbar = () => {
  const navigate = useNavigate();
  const { mode, cycleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  // Auth Data
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const userType = localStorage.getItem('userType'); 

  // Admin URL
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

      {/* MOBILE ACTIONS */}
      <div className="mobile-actions">
        <button onClick={cycleTheme} className="theme-btn mobile-theme-btn">
            {getThemeIcon()}
        </button>
        <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
        </div>
      </div>

      {/* --- LINKS MENU --- */}
      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        
        <button onClick={cycleTheme} className="theme-btn desktop-theme-btn">
            {getThemeIcon()}
        </button>

        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>

        {/* --- BUYER LINKS (Normal User) --- */}
        {userType === 'BUYER' && (
            <>
                {/* 5. Search Icon Added */}
                <Link to="/properties" className="nav-link" onClick={closeMenu} style={{display:'flex', alignItems:'center', gap:'5px'}}>
                    <FaSearch /> Find Homes
                </Link>

                {/* 3. Combined Button (Bookings + Wishlist) */}
                <Link to="/user-dashboard" className="nav-link" onClick={closeMenu} style={{display:'flex', alignItems:'center', gap:'5px', color:'var(--accent-orange)'}}>
                    <FaThLarge /> My Dashboard
                </Link>

                {/* 2. Movers Removed (My Dashboard me already request button hai) */}
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

        {/* --- ADMIN LINK --- */}
        {(userType === 'ADMIN' || username === 'Shubham_Singh' || username === 'admin') && (
            <a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" className="nav-link" onClick={closeMenu} style={{color: '#ff4d4d', fontWeight: 'bold'}}>
                ⚙️ Admin Panel
            </a>
        )}

        {/* AUTH SECTION */}
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexDirection: 'inherit' }}>
            
            {/* 1. User Name Removed, Only Icon Added */}
            <Link 
                to="/profile" 
                onClick={closeMenu} 
                title={`Hi, ${username}`} // Hover karne par naam dikhega
                style={{ color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', transition: '0.2s' }}
            >
                <FaUserCircle size={32} /> {/* Big Icon */}
            </Link>

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