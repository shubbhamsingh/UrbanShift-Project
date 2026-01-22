import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // ✅ CSS Import

const Home = () => {
  return (
    <div className="home-container">
      {/* --- HERO SECTION --- */}
      <div className="hero-section">
        <div className="overlay"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Move to your <span className="highlight">Dream Home</span> <br/> without the Stress.
          </h1>
          <p className="hero-subtitle">
            India's first platform connecting you to verified Rental Homes <br/> and trusted Packers & Movers in one place.
          </p>
          
          <div className="button-group">
            <Link to="/properties" className="btn-3d-orange main-btn">
                🏠 Find a Home
            </Link>
            <Link to="/packers" className="btn-3d-orange main-btn secondary-btn">
                🚚 Book Movers
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="features-section">
        <h2 className="section-title">Why Choose Urban<span className="highlight-text">Shift</span>?</h2>
        
        <div className="cards-container">
          <div className="card-3d feature-card">
            <div className="icon">🏡</div>
            <h3 className="card-title">Verified Listings</h3>
            <p className="card-text">Direct connections with verified property owners. No fake listings, no hidden brokers.</p>
          </div>

          <div className="card-3d feature-card">
            <div className="icon">📦</div>
            <h3 className="card-title">Safe Relocation</h3>
            <p className="card-text">Top-rated Packers & Movers ensuring your belongings reach safely and on time.</p>
          </div>

          <div className="card-3d feature-card">
            <div className="icon">🛡️</div>
            <h3 className="card-title">Secure & Trusted</h3>
            <p className="card-text">We prioritize your safety with background checks and secure payment options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;