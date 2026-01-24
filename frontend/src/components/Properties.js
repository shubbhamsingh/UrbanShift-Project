import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]); 
  const [filteredProps, setFilteredProps] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- FILTERS STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(50000); 

  // 👇 LIVE BACKEND URL (Change Localhost to Render)
  const BACKEND_URL = 'https://urbanshift-project.onrender.com';

  // ✅ 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 Localhost removed, using Live URL
        const res = await axios.get(`${BACKEND_URL}/api/properties/`);
        setProperties(res.data);
        setFilteredProps(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ 2. Filter Logic
  useEffect(() => {
    let temp = properties;

    if (searchTerm) {
      temp = temp.filter(p => 
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'ALL') {
      temp = temp.filter(p => p.category === category);
    }

    temp = temp.filter(p => p.price <= maxPrice);

    setFilteredProps(temp);
  }, [searchTerm, category, maxPrice, properties]);

  // 🖼️ SMART IMAGE HELPER
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    
    if (imageObj.image) {
        // Agar backend full URL bhej raha hai
        if (imageObj.image.startsWith('http')) {
            return imageObj.image;
        }
        // 👇 Relative path ke sath Live URL joda
        return `${BACKEND_URL}${imageObj.image}`;
    }
    return imageObj.image_url || 'https://via.placeholder.com/300';
  };

  return (
    <div className="properties-page">
      
      {/* --- FILTER BAR --- */}
      <div className="filter-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="🔍 Search by Location (e.g. Jaipur)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="RENT">For Rent</option>
            <option value="SELL">For Sale</option>
          </select>

          <div className="price-filter">
            <label>Max Price: ₹{maxPrice}</label>
            <input 
              type="range" min="1000" max="100000" step="1000" 
              value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      <div className="results-container">
        <h2 style={{color: 'var(--text-primary)'}}>
            Found {filteredProps.length} Properties
        </h2>

        {loading ? (
            <p style={{color: 'var(--text-primary)'}}>Loading properties...</p>
        ) : filteredProps.length === 0 ? (
            <div className="no-results">
                <h3>😕 No properties found.</h3>
                <p>Try changing your filters.</p>
            </div>
        ) : (
            <div className="prop-grid">
                {filteredProps.map(prop => (
                    <div key={prop.id} className="prop-card">
                        <div className="img-wrapper">
                            <span className={`badge ${prop.category}`}>{prop.category}</span>
                            <img 
                                src={prop.images && prop.images.length > 0 
                                    ? getImageUrl(prop.images[0])
                                    : 'https://via.placeholder.com/300'} 
                                alt={prop.title} 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                            />
                        </div>
                        <div className="content">
                            <h3>{prop.title}</h3>
                            <p className="price">₹{prop.price}</p>
                            <p className="detail">📍 {prop.location}</p>
                            <p className="detail">🛏 {prop.bedrooms} BHK</p>
                            
                            <Link to={`/property/${prop.id}`}>
                                <button className="view-btn-full">View Details</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Properties;