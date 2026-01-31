import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaLaptop, FaUserCircle, FaCommentDots, FaBars, FaTimes, FaDownload } from 'react-icons/fa';
import logo from '../logo.png';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Track location changes
  const { mode, cycleTheme } = useContext(ThemeContext);

  // --- STATE MANAGEMENT ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // PWA State
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [userType, setUserType] = useState(localStorage.getItem('userType')?.toUpperCase() || ''); // 👈 Store uppercase for consistency

  // Theme Check
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const token = localStorage.getItem('token');

  // 👈 Re-read userType on every navigation
  useEffect(() => {
    setUserType(localStorage.getItem('userType')?.toUpperCase() || '');
  }, [location.pathname]);

  // --- 1. HANDLE SCREEN RESIZE ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. PWA INSTALL LOGIC ---
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setMenuOpen(false);
      navigate('/login');
    }
  };

  // --- STYLES ---
  const colors = {
    bg: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#333333',
    menuBg: isDark ? '#1e1e1e' : '#f9f9f9',
    border: isDark ? '#333' : '#e0e0e0',
    icon: isDark ? '#f1c40f' : '#f39c12'
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '10px 15px' : '15px 40px',
    background: colors.bg,
    boxShadow: isDark ? '0 4px 10px rgba(255,255,255,0.05)' : '0 4px 15px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: '0.3s',
    borderBottom: isDark ? '1px solid #333' : 'none',
    height: '70px'
  };

  const mobileMenuStyle = {
    position: 'absolute',
    top: '70px',
    left: 0,
    width: '100%',
    background: colors.menuBg,
    display: menuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    padding: '20px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    borderBottom: `1px solid ${colors.border}`,
    gap: '15px',
    zIndex: 999
  };

  const logoContainer = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const logoText = {
    fontSize: isMobile ? '1.4rem' : '1.8rem',
    fontWeight: '800',
    color: colors.text,
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
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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

  const iconBtnStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    color: colors.text
  };

  const getThemeIcon = () => {
    if (mode === 'light') return <FaSun title="Light Mode" />;
    if (mode === 'dark') return <FaMoon title="Dark Mode" />;
    return <FaLaptop title="System Mode" />;
  };

  // 👇 SMART URL SETUP (Automatic Detection)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const ADMIN_URL = isLocal 
    ? "http://127.0.0.1:8000/admin/" 
    : "https://urbanshift-project.onrender.com/admin/";

  return (
    <nav style={navStyle}>

      {/* --- LEFT: Logo Only (Always Visible) --- */}
      <Link to="/" style={logoContainer}>
        <img src={logo} alt="Logo" style={{ height: isMobile ? '30px' : '40px', width: 'auto' }} />
        <span style={logoText}>
          Urban<span style={{ color: '#e67e22' }}>Shift</span>
        </span>
      </Link>

      {/* --- RIGHT: Icons (Install, Theme, Hamburger) + Desktop Links --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '25px' }}>

        {/* PWA Install Button (Always in Navbar now) */}
        {deferredPrompt && !isAppInstalled && (
          <button onClick={handleInstallClick} style={iconBtnStyle} title="Install App">
            <FaDownload color="#2ecc71" />
          </button>
        )}

        <div onClick={cycleTheme} style={{ ...iconBtnStyle, color: isDark ? '#f1c40f' : '#f39c12' }}>
          {getThemeIcon()}
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={linkStyle}>Home</Link>

            {token ? (
              <>
                {userType === 'ADMIN' ? (
                  /* ✅ OPEN ADMIN PANEL IN NEW TAB */
                  <a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>🛡️ Admin Panel</a>
                ) : (
                  <Link to={
                    userType === 'SELLER' ? "/seller-dashboard" :
                    userType === 'COMPANY' ? "/company-dashboard" :
                    "/user-dashboard"
                  } style={linkStyle}>
                    {userType === 'SELLER' ? '📊 Seller Panel' : userType === 'COMPANY' ? '🚚 Mover Panel' : ' My Dashboard'}
                  </Link>
                )}

                <Link to="/properties" style={linkStyle}>Find Homes</Link>
                <Link to="/chat/inbox" style={linkStyle}>
                  <FaCommentDots size={20} /> Chat
                </Link>

                {/* ✅ FIX: Post Property Button Only for SELLER */}
                {userType === 'SELLER' && (
                  <Link to="/add-property" style={{ ...btnStyle, background: '#e67e22', color: 'white' }}>+ Post Property</Link>
                )}

                <Link to="/profile" style={{ color: isDark ? '#fff' : '#333', fontSize: '1.6rem' }}><FaUserCircle /></Link>
                <button onClick={handleLogout} style={{ ...btnStyle, background: 'transparent', border: `1px solid ${isDark ? '#e74c3c' : '#c0392b'}`, color: isDark ? '#e74c3c' : '#c0392b' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/properties" style={linkStyle}>Properties</Link>
                <Link to="/login" style={{ ...btnStyle, background: '#3498db', color: 'white' }}>Login</Link>
                <Link to="/register" style={{ ...btnStyle, background: '#2ecc71', color: 'white' }}>Register</Link>
              </>
            )}
          </div>
        )}

        {/* HAMBURGER MENU (Moved to Right, Mobile Only) */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={iconBtnStyle}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobile && menuOpen && (
        <div style={mobileMenuStyle}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>🏠 Home</Link>
          
          {/* ❌ REMOVED: Install App button from here as requested */}

          {token ? (
            <>
              {userType === 'ADMIN' ? (
                 <a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} style={linkStyle}>🛡️ Admin Panel</a>
              ) : (
                <Link to={
                  userType === 'SELLER' ? "/seller-dashboard" :
                  userType === 'COMPANY' ? "/company-dashboard" :
                  "/user-dashboard"
                } onClick={() => setMenuOpen(false)} style={linkStyle}>
                  {userType === 'SELLER' ? '📊 Seller Panel' : userType === 'COMPANY' ? '🚚 Mover Panel' : '👤 My Dashboard'}
                </Link>
              )}
              
              <Link to="/properties" onClick={() => setMenuOpen(false)} style={linkStyle}>🔍 Find Homes</Link>
              <Link to="/chat/inbox" onClick={() => setMenuOpen(false)} style={linkStyle}>💬 Chat</Link>

              {/* ✅ FIX: Post Property Only for SELLER in Mobile Menu */}
              {userType === 'SELLER' && (
                <Link to="/add-property" onClick={() => setMenuOpen(false)} style={{ ...linkStyle, color: '#e67e22' }}>➕ Post Property</Link>
              )}

              <Link to="/profile" onClick={() => setMenuOpen(false)} style={linkStyle}>👤 My Profile</Link>
              <div style={{ borderTop: `1px solid ${colors.border}` }}></div>
              <button onClick={handleLogout} style={{ ...btnStyle, width: '100%', background: '#e74c3c', color: 'white', justifyContent: 'center' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/properties" onClick={() => setMenuOpen(false)} style={linkStyle}>Properties</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ ...btnStyle, background: '#3498db', color: 'white', justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ ...btnStyle, background: '#2ecc71', color: 'white', justifyContent: 'center' }}>Register</Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
};

export default Navbar;