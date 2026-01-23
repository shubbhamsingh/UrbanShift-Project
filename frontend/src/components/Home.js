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
  // Ye check karega ki URL me http pehle se hai ya nahi
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';

    if (imageObj.image) {
        // Agar backend full URL bhej raha hai (http se shuru ho raha hai)
        if (imageObj.image.startsWith('http')) {
            return imageObj.image;
        }
        // Agar relative path hai (/media/...)
        return `http://127.0.0.1:8000${imageObj.image}`;
    }
    // Agar direct URL string hai
    return imageObj.image_url || 'https://via.placeholder.com/300';
  };

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

      {/* --- 🔥 LATEST PROPERTIES SECTION --- */}
      <div className="latest-properties-section">
        <h2 className="section-title">Latest <span className="highlight-text">Listings</span></h2>
        
        {isLoading ? (
            <p style={{textAlign:'center', color:'white'}}>Loading amazing homes...</p>
        ) : recentProperties.length === 0 ? (
            <p style={{textAlign:'center', color:'#ccc'}}>No properties listed yet. Be the first!</p>
        ) : (
            <div className="property-grid-home">
                {recentProperties.map((prop) => (
                    <div key={prop.id} className="card-3d property-card-home">
                        <img 
                            // 👇 Yahan humne Smart Function use kiya hai
                            src={prop.images && prop.images.length > 0 
                                ? getImageUrl(prop.images[0])
                                : 'https://via.placeholder.com/300'} 
                            alt={prop.title} 
                            className="prop-img-home"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }} // Fallback
                        />
                        <div className="prop-info-home">
                            <h3>{prop.title}</h3>
                            <p className="price">₹{prop.price}/mo</p>
                            <p className="loc">📍 {prop.location}</p>
                            <Link to={`/property/${prop.id}`} className="view-btn">View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Link to="/properties" className="btn-text">View All Properties →</Link>
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