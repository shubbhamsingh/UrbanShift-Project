import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      shadow: isDark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.05)',
      inputBg: isDark ? '#2c2c2c' : '#ffffff',
      priceColor: isDark ? '#2ecc71' : '#27ae60', // Green for price
      noImageBg: isDark ? '#333' : '#eee'
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Smart URL (Local vs Prod)
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const BASE_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";
        
        const response = await fetch(`${BASE_URL}/api/properties/`);
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter Properties based on Search
  const filteredProperties = properties.filter(prop => 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- STYLES ---
  const styles = {
      container: { padding: '30px 20px', minHeight: '100vh', background: colors.bg, transition: '0.3s' },
      header: { textAlign: 'center', marginBottom: '30px', color: colors.text },
      
      // Search Bar
      searchBox: {
          display: 'flex',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto 40px',
          background: colors.inputBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '50px',
          padding: '10px 20px',
          boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.05)'
      },
      input: {
          border: 'none',
          outline: 'none',
          width: '100%',
          marginLeft: '10px',
          fontSize: '1rem',
          background: 'transparent',
          color: colors.text
      },

      // Grid
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
      
      // Card
      card: { 
          background: colors.cardBg, 
          border: `1px solid ${colors.border}`, 
          borderRadius: '15px', 
          overflow: 'hidden', 
          boxShadow: colors.shadow,
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
      },
      
      imageBox: { width: '100%', height: '220px', objectFit: 'cover' },
      noImageBox: { width: '100%', height: '220px', backgroundColor: colors.noImageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.subText },
      
      content: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
      title: { margin: '0 0 10px 0', fontSize: '1.25rem', color: colors.text, fontWeight: 'bold' },
      location: { color: colors.subText, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', fontSize: '0.9rem' },
      price: { color: colors.priceColor, fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center' },
      
      button: { 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px', 
          cursor: 'pointer', 
          fontSize: '1rem', 
          fontWeight: '600',
          marginTop: 'auto', // Pushes button to bottom
          transition: '0.2s'
      }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px', color: colors.text}}><h3>⏳ Finding best homes for you...</h3></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
          <h2>🏡 Available Properties for Rent</h2>
          <p style={{color: colors.subText}}>Find your perfect space in the city.</p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBox}>
          <FaSearch color={colors.subText} />
          <input 
            placeholder="Search by location or property name..." 
            style={styles.input} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      
      {/* Properties Grid */}
      <div style={styles.grid}>
        
        {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
            <div key={property.id} style={styles.card} className="property-card">
                
                {/* Image Handling */}
                {property.image ? (
                <img src={property.image} alt={property.title} style={styles.imageBox} />
                ) : (
                <div style={styles.noImageBox}>
                    <span>🏠 No Image Available</span>
                </div>
                )}

                {/* Content */}
                <div style={styles.content}>
                    <h3 style={styles.title}>{property.title}</h3>
                    
                    <p style={styles.location}>
                        <FaMapMarkerAlt /> {property.location}
                    </p>
                    
                    <h4 style={styles.price}>
                        <FaRupeeSign size={16}/> {property.price.toLocaleString()}/month
                    </h4>
                    
                    {/* View Details Button */}
                    <Link to={`/properties/${property.id}`} style={{ textDecoration: 'none' }}>
                        <button 
                            style={styles.button}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                        >
                            View Details ➜
                        </button>
                    </Link>
                </div>
            </div>
            ))
        ) : (
            <div style={{gridColumn: '1/-1', textAlign:'center', color: colors.subText}}>
                <h3>❌ No properties found matching "{searchTerm}"</h3>
            </div>
        )}

      </div>
    </div>
  );
};

export default PropertyList;