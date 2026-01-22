import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Ye import jaruri hai

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://urbanshift-project.onrender.com/api/properties/');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Properties for Rent</h2>
      
      {/* Grid Layout for Properties */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        
        {properties.map((property) => (
          <div key={property.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            
            {/* Image */}
            {property.image ? (
              <img src={property.image} alt={property.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>No Image</span>
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{property.title}</h3>
              <p style={{ color: '#555' }}>📍 {property.location}</p>
              <h4 style={{ color: '#28a745' }}>₹{property.price}/month</h4>
              
              {/* ✅ View Details Button linked to Detail Page */}
              <Link to={`/properties/${property.id}`} style={{ textDecoration: 'none' }}>
                <button 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '10px' 
                  }}
                >
                  View Details ➜
                </button>
              </Link>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PropertyList;