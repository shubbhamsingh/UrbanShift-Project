import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link import kiya

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/properties/')
      .then(response => {
        setProperties(response.data);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>🏡 Available Properties</h2>
      
      {properties.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No properties listed yet.</p>
      ) : (
        // ✅ Flex wrap container
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {properties.map(property => (
            <div key={property.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '10px', 
              width: '320px',
              background: '#fff',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              // ✅ Alignment Fix: Isse card ki height barabar rahegi aur content fail jayega
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* Image Section */}
              <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', height: '200px', background: '#f9f9f9', flexShrink: 0 }}>
                {property.image ? (
                   <img src={property.image} alt="Main" style={{ width: '320px', height: '100%', objectFit: 'cover', flexShrink: 0 }} />
                ) : null}
                
                {property.images && property.images.map((imgObj) => (
                   <img key={imgObj.id} src={imgObj.image} alt="Gallery" style={{ width: '320px', height: '100%', objectFit: 'cover', flexShrink: 0 }} />
                ))}

                {!property.image && (!property.images || property.images.length === 0) && (
                   <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Images</div>
                )}
              </div>

              {/* Swipe Hint */}
              {(property.images && property.images.length > 0) && (
                <p style={{textAlign:'center', fontSize:'12px', color:'gray', margin:'5px 0'}}>Swipe ➡ to see more photos</p>
              )}

              {/* Details Section */}
              {/* ✅ flexGrow: 1 ka matlab ye hissa baki jagah lega */}
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{property.title}</h3>
                <p><strong>📍 Location:</strong> {property.city}</p>
                <p><strong>💰 Price:</strong> ₹{property.price}</p>
                <p><strong>🏠 Type:</strong> {property.property_type}</p>
                
                {/* ✅ marginTop: 'auto' button ko hamesha niche chipka dega */}
                <Link to={`/properties/${property.id}`} style={{ marginTop: 'auto', textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', padding: '10px', background: '#28a745', color: 'white', 
                    border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px'
                  }}>
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;