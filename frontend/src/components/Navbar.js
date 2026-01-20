import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Check karein ki user login hai ya nahi (Local Storage se)
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    // Logout logic: Data hatayein aur page reload karein
    localStorage.removeItem('userInfo');
    alert('Logged out successfully!');
    navigate('/login');
    window.location.reload(); // Page refresh taki navbar update ho jaye
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#333', color: 'white', alignItems: 'center' }}>
      
      {/* Logo */}
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>UrbanShift 🚚</Link>
      </h2>

      {/* Links */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>Home</Link>
        <Link to="/properties" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>Properties</Link>
        <Link to="/movers" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>Packers & Movers</Link>

        {/* Dynamic Login/Logout Button */}
        {user ? (
          // Agar user Login hai to ye dikhega:
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#aaa' }}>Hi, {user.username} 👋</span>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        ) : (
          // Agar user Login NAHI hai to ye dikhega:
          <Link to="/login">
            <button style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Login
            </button>
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;