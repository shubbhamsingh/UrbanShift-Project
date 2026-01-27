import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaRupeeSign } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Filters
  const [searchLocation, setSearchLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000000); // Default Max: 1 Crore

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Fetch All Properties
  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/properties/`);
      // Sirf wo dikhao jo SOLD nahi hain
      const availableProps = res.data.filter(p => !p.is_sold);
      setProperties(availableProps);
      setFilteredProperties(availableProps);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  // ✅ Filter Logic (Real-time)
  useEffect(() => {
    let result = properties;

    // 1. Location Search
    if (searchLocation) {
      result = result.filter(p => 
        p.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        p.title.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // 2. Category Filter
    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    // 3. Price Filter
    result = result.filter(p => parseFloat(p.price) <= maxPrice);

    setFilteredProperties(result);
  }, [searchLocation, filterCategory, maxPrice, properties]);

  // 🖼️ SMART IMAGE HELPER
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    
    if (imageObj.image_url) {
        return imageObj.image_url;
    }

    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `${BACKEND_URL}${imageObj.image}`;
    }
    
    return 'https://via.placeholder.com/300';
  };

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      inputBg: isDark ? '#2a2a2a' : '#eeeeee',
      shadow: isDark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.05)',
  };

  return (
    <div style={{...pageStyle, background: colors.bg, color: colors.text}}>
      
      {/* --- SEARCH & FILTER BAR --- */}
      <div style={{...searchContainerStyle, background: colors.cardBg, border: `1px solid ${colors.border}`}}>
        
        {/* Search Input */}
        <div style={{...inputGroupStyle, background: colors.inputBg}}>
            <FaSearch color={colors.subText} />
            <input 
                type="text" 
                placeholder="Search by Location (e.g. Jaipur)..." 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{...inputStyle, color: colors.text}}
            />
        </div>

        {/* Category Dropdown */}
        <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{...selectStyle, background: colors.inputBg, color: colors.text}}
        >
            <option value="All">All Categories</option>
            <option value="RENT">Rent</option>
            <option value="SELL">Buy</option>
        </select>

        {/* ✅ Price Slider (Max 1 Crore) */}
        <div style={{display:'flex', alignItems:'center', gap:'10px', color: colors.text, width:'100%', maxWidth:'300px'}}>
            <span style={{fontSize:'0.9rem'}}>Max: ₹{maxPrice.toLocaleString()}</span>
            <input 
                type="range" 
                min="0" 
                max="10000000" 
                step="5000"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{width:'100%', accentColor:'#a855f7'}}
            />
        </div>

      </div>

      {/* --- RESULTS HEADER --- */}
      <h3 style={{color: colors.text, marginBottom:'20px'}}>Found {filteredProperties.length} Properties</h3>

      {/* --- PROPERTY GRID --- */}
      {loading ? (
        <p style={{color: colors.text}}>Loading...</p>
      ) : filteredProperties.length === 0 ? (
        <div style={{textAlign:'center', marginTop:'50px', color: colors.subText}}>
            <span style={{fontSize:'3rem'}}>🧐</span>
            <h3>No properties found.</h3>
            <p>Try changing your filters.</p>
        </div>
      ) : (
        <div style={gridStyle}>
            {filteredProperties.map(property => (
                <Link to={`/properties/${property.id}`} key={property.id} style={{textDecoration:'none'}}>
                    <div style={{...cardStyle, background: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: colors.shadow}}>
                        {/* Image */}
                        <div style={{height: '200px', overflow: 'hidden', borderBottom: `1px solid ${colors.border}`}}>
                            <img 
                                src={property.images && property.images.length > 0 
                                    ? getImageUrl(property.images[0]) 
                                    : 'https://via.placeholder.com/300'} 
                                alt={property.title}
                                style={{width:'100%', height:'100%', objectFit:'cover', transition:'0.3s'}}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                            />
                        </div>

                        {/* Content */}
                        <div style={{padding: '20px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                <span style={{background: property.category === 'RENT' ? '#f1c40f' : '#2ecc71', color:'black', padding:'2px 8px', borderRadius:'5px', fontSize:'0.7rem', fontWeight:'bold'}}>
                                    {property.category}
                                </span>
                                <span style={{color: colors.subText, fontSize:'0.8rem'}}>
                                    <FaBed /> {property.bedrooms}
                                </span>
                            </div>

                            <h3 style={{color: colors.text, margin: '0 0 10px 0', fontSize:'1.1rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                {property.title}
                            </h3>

                            <p style={{color: colors.subText, fontSize: '0.9rem', display:'flex', alignItems:'center', gap:'5px', marginBottom:'15px'}}>
                                <FaMapMarkerAlt /> {property.location}
                            </p>

                            <div style={{borderTop: `1px solid ${colors.border}`, paddingTop:'15px'}}>
                                <h4 style={{color: '#a855f7', margin:0, display:'flex', alignItems:'center'}}>
                                    <FaRupeeSign size={14}/> {parseFloat(property.price).toLocaleString('en-IN')}
                                    {property.category === 'RENT' && <span style={{fontSize:'0.8rem', color: colors.subText, fontWeight:'normal'}}>/mo</span>}
                                </h4>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const pageStyle = { padding: '40px', minHeight: '100vh', transition: '0.3s' };
const searchContainerStyle = { 
    padding: '20px', borderRadius: '15px', 
    display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', 
    marginBottom: '30px', transition: '0.3s'
};
const inputGroupStyle = { 
    display: 'flex', alignItems: 'center', 
    padding: '10px 15px', borderRadius: '8px', flex: 1, minWidth: '200px', transition: '0.3s'
};
const inputStyle = { 
    background: 'transparent', border: 'none', 
    marginLeft: '10px', width: '100%', outline: 'none' 
};
const selectStyle = { 
    padding: '10px', borderRadius: '8px', 
    border: 'none', cursor: 'pointer', transition: '0.3s'
};
const gridStyle = { 
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' 
};
// Removed cardStyle from here because it's now applied inline for dynamic colors

// Default Card Style for structure
const cardStyle = { 
    borderRadius: '15px', overflow: 'hidden', 
    transition: 'transform 0.2s', cursor: 'pointer' 
};

export default Properties;