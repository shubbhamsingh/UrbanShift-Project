import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navStyle = {
    background: '#333',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: 'bold'
  };

  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>UrbanShift 🏡</h2>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/properties" style={linkStyle}>Properties</Link>
        <Link to="/movers" style={linkStyle}>Packers & Movers</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;