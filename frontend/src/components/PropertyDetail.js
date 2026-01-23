import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './propertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/properties/${id}/`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Property not found or connection failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // 🖼️ SMART IMAGE HELPER
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/600';
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `http://127.0.0.1:8000${imageObj.image}`;
    }
    return imageObj.image_url || 'https://via.placeholder.com/600';
  };

  if (loading) return <div className="loading-container"><h2>⏳ Loading Property Details...</h2></div>;
  if (error) return <div className="error-container"><h2>❌ {error}</h2><Link to="/properties" className="back-btn">← Back to Listings</Link></div>;

  return (
    <div className="detail-page">
      <div className="detail-container">
        
        {/* --- HEADER --- */}
        <div className="detail-header">
            <Link to="/properties" className="back-link">← Back</Link>
            <span className={`status-badge ${property.category}`}>{property.category}</span>
        </div>

        <div className="content-wrapper">
            
            {/* --- LEFT: IMAGES --- */}
            <div className="image-section">
                <img 
                    // 👇 Main Image Fix
                    src={property.images && property.images.length > 0 
                        ? getImageUrl(property.images[0])
                        : 'https://via.placeholder.com/600'} 
                    alt={property.title} 
                    className="main-image"
                />
                
                {/* Thumbnails Fix */}
                {property.images && property.images.length > 1 && (
                    <div className="thumbnails">
                        {property.images.slice(1).map((img, idx) => (
                            <img 
                                key={idx}
                                // 👇 Thumbnail Fix
                                src={getImageUrl(img)} 
                                alt="thumb"
                                className="thumb-img"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* --- RIGHT: INFO --- */}
            <div className="info-section">
                <h1 className="prop-title">{property.title}</h1>
                <h2 className="prop-price">₹{property.price} <span className="per-month">/ month</span></h2>
                
                <div className="prop-meta">
                    <p>📍 <strong>Location:</strong> {property.location}</p>
                    <p>🛏 <strong>Bedrooms:</strong> {property.bedrooms}</p>
                    <p>📅 <strong>Posted:</strong> {new Date(property.created_at).toLocaleDateString()}</p>
                </div>

                <div className="prop-desc">
                    <h3>Description</h3>
                    <p>{property.description}</p>
                </div>

                <div className="seller-box">
                    <h3>👤 Owner Details</h3>
                    <p><strong>Name:</strong> {property.seller_name || "Verified Owner"}</p>
                    <button className="contact-btn">📞 Contact Owner</button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;