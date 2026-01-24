import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './home.css'; 

const Home = () => {
  const [recentProperties, setRecentProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Backend se Properties lana
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/properties/');
        // Sirf latest 3 properties dikhayenge
        setRecentProperties(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching properties", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // 🖼️ SMART IMAGE HELPER FUNCTION
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) {
            return imageObj.image;
        }
        return `http://127.0.0.1:8000${imageObj.image}`;
    }
    return imageObj.image_url || 'https://via.placeholder.com/300';
  };

  return (
    <div className="home-container" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* --- HERO SECTION (Iska background image/dark hi rahega usually) --- */}
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

      {/* --- 🔥 LATEST PROPERTIES SECTION --- */}
      {/* 👇 FIXED: Background color ab Theme ke hisab se change hoga */}
      <div className="latest-properties-section" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '50px 0' }}>
        <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>Latest <span className="highlight-text">Listings</span></h2>
        
        {isLoading ? (
            // 👇 FIXED: Color 'white' hata diya, ab theme color lega
            <p style={{textAlign:'center', color:'var(--text-primary)'}}>Loading amazing homes...</p>
        ) : recentProperties.length === 0 ? (
            <p style={{textAlign:'center', color:'var(--text-secondary)'}}>No properties listed yet. Be the first!</p>
        ) : (
            <div className="property-grid-home">
                {recentProperties.map((prop) => (
                    <div key={prop.id} className="card-3d property-card-home" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        <img 
                            src={prop.images && prop.images.length > 0 
                                ? getImageUrl(prop.images[0])
                                : 'https://via.placeholder.com/300'} 
                            alt={prop.title} 
                            className="prop-img-home"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }} 
                        />
                        <div className="prop-info-home">
                            <h3 style={{ color: 'var(--text-primary)' }}>{prop.title}</h3>
                            <p className="price" style={{ color: '#ff5722' }}>₹{prop.price}/mo</p>
                            <p className="loc" style={{ color: 'var(--text-secondary)' }}>📍 {prop.location}</p>
                            <Link to={`/property/${prop.id}`} className="view-btn">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Link to="/properties" className="btn-text" style={{ color: '#ff5722' }}>View All Properties →</Link>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      {/* 👇 FIXED: Background aur Text color dynamic kar diye */}
      <div className="features-section" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '50px' }}>
        <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>Why Choose Urban<span className="highlight-text">Shift</span>?</h2>
        
        <div className="cards-container">
          <div className="card-3d feature-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="icon">🏡</div>
            <h3 className="card-title" style={{ color: 'var(--text-primary)' }}>Verified Listings</h3>
            <p className="card-text" style={{ color: 'var(--text-secondary)' }}>Direct connections with verified property owners. No fake listings, no hidden brokers.</p>
          </div>

          <div className="card-3d feature-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="icon">📦</div>
            <h3 className="card-title" style={{ color: 'var(--text-primary)' }}>Safe Relocation</h3>
            <p className="card-text" style={{ color: 'var(--text-secondary)' }}>Top-rated Packers & Movers ensuring your belongings reach safely and on time.</p>
          </div>

          <div className="card-3d feature-card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="icon">🛡️</div>
            <h3 className="card-title" style={{ color: 'var(--text-primary)' }}>Secure & Trusted</h3>
            <p className="card-text" style={{ color: 'var(--text-secondary)' }}>We prioritize your safety with background checks and secure payment options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;