import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './home.css'; // Hero section aur animations ke liye CSS rakhi hai

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const [recentProperties, setRecentProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      sectionBg: isDark ? '#121212' : '#ffffff', // White section in light mode
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      shadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
      price: '#ff5722'
  };

  // Live Backend URL
  const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/properties/`);
        setRecentProperties(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching properties", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [BACKEND_URL]);

  // 🖼️ SMART IMAGE HELPER
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    
    // Agar object hai aur usme image URL hai
    if (imageObj.image_url) return imageObj.image_url;

    // Agar image path hai
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `${BACKEND_URL}${imageObj.image}`;
    }
    return 'https://via.placeholder.com/300';
  };

  // --- INLINE STYLES FOR THEME ---
  const styles = {
      container: { backgroundColor: colors.bg, minHeight: '100vh', transition: '0.3s' },
      section: { backgroundColor: colors.sectionBg, color: colors.text, padding: '50px 0', transition: '0.3s' },
      card: { 
          backgroundColor: colors.cardBg, 
          color: colors.text, 
          border: `1px solid ${colors.border}`,
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: colors.shadow,
          transition: 'transform 0.3s'
      }
  };

  return (
    <div className="home-container" style={styles.container}>
      
      {/* HERO SECTION (CSS Class keeps image intact) */}
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
            <Link to="/properties" className="btn-3d-orange main-btn">🏠 Find a Home</Link>
            <Link to="/packers" className="btn-3d-orange main-btn secondary-btn">🚚 Book Movers</Link>
          </div>
        </div>
      </div>

      {/* LATEST PROPERTIES SECTION */}
      <div className="latest-properties-section" style={styles.section}>
        <h2 className="section-title" style={{ color: colors.text }}>Latest <span className="highlight-text">Listings</span></h2>
        
        {isLoading ? (
            <p style={{textAlign:'center', color: colors.text}}>Loading amazing homes...</p>
        ) : recentProperties.length === 0 ? (
            <p style={{textAlign:'center', color: colors.subText}}>No properties listed yet. Be the first!</p>
        ) : (
            <div className="property-grid-home">
                {recentProperties.map((prop) => (
                    <div key={prop.id} className="card-3d property-card-home" style={styles.card}>
                        
                        {/* Image Handling */}
                        <div style={{height: '200px', overflow: 'hidden'}}>
                            <img 
                                src={prop.images && prop.images.length > 0 ? getImageUrl(prop.images[0]) : 'https://via.placeholder.com/300'} 
                                alt={prop.title} 
                                className="prop-img-home"
                                style={{width:'100%', height:'100%', objectFit:'cover'}}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }} 
                            />
                        </div>

                        <div className="prop-info-home" style={{padding:'20px'}}>
                            <h3 style={{ color: colors.text, margin:'0 0 10px 0' }}>{prop.title}</h3>
                            <p className="price" style={{ color: colors.price, fontWeight:'bold', fontSize:'1.1rem' }}>₹{prop.price}/mo</p>
                            <p className="loc" style={{ color: colors.subText }}>📍 {prop.location}</p>
                            
                            {/* Corrected Link */}
                            <Link to={`/properties/${prop.id}`} className="view-btn" style={{marginTop:'15px', display:'inline-block'}}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        <div style={{textAlign: 'center', marginTop: '40px'}}>
            <Link to="/properties" className="btn-text" style={{ color: colors.price, fontWeight:'bold', fontSize:'1.1rem' }}>View All Properties →</Link>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section" style={{...styles.section, paddingBottom: '80px', backgroundColor: colors.bg}}>
        <h2 className="section-title" style={{ color: colors.text }}>Why Choose Urban<span className="highlight-text">Shift</span>?</h2>
        
        <div className="cards-container">
          
          <div className="card-3d feature-card" style={styles.card}>
            <div className="icon">🏡</div>
            <h3 className="card-title" style={{ color: colors.text }}>Verified Listings</h3>
            <p className="card-text" style={{ color: colors.subText }}>Direct connections with verified property owners. No fake listings, no hidden brokers.</p>
          </div>
          
          <div className="card-3d feature-card" style={styles.card}>
            <div className="icon">📦</div>
            <h3 className="card-title" style={{ color: colors.text }}>Safe Relocation</h3>
            <p className="card-text" style={{ color: colors.subText }}>Top-rated Packers & Movers ensuring your belongings reach safely and on time.</p>
          </div>
          
          <div className="card-3d feature-card" style={styles.card}>
            <div className="icon">🛡️</div>
            <h3 className="card-title" style={{ color: colors.text }}>Secure & Trusted</h3>
            <p className="card-text" style={{ color: colors.subText }}>We prioritize your safety with background checks and secure payment options.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;