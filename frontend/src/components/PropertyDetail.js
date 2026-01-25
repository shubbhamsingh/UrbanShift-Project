import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaTimes, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import './propertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false); 
  
  const [showContact, setShowContact] = useState(false);

  // 👇 Smart URL Setup (Local aur Live dono ke liye)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 Uses dynamic BACKEND_URL
        const res = await axios.get(`${BACKEND_URL}/api/properties/${id}/`);
        setProperty(res.data);
        setLoading(false); 

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const wishlistRes = await axios.get(`${BACKEND_URL}/api/properties/wishlist/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const found = wishlistRes.data.some(item => item.property.id === res.data.id);
                setIsWishlisted(found);
            } catch (wishlistErr) {
                console.warn("Wishlist check failed");
            }
        }
      } catch (err) {
        console.error("Main Error:", err);
        setError("Property not found or connection failed.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, BACKEND_URL]); // Added BACKEND_URL to dependency

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please Login to save properties! 🔒");
        navigate('/login');
        return;
    }
    try {
        await axios.post(`${BACKEND_URL}/api/properties/${id}/toggle-wishlist/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Toggle UI state based on previous state (optimistic update) or response
        setIsWishlisted(!isWishlisted); 
        
        if (!isWishlisted) toast.success("Added to DreamHome ❤️");
        else toast.info("Removed from DreamHome 💔");
    } catch (err) {
        toast.error("Something went wrong!");
    }
  };

  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/600';
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        // 👇 Relative path + Dynamic URL
        return `${BACKEND_URL}${imageObj.image}`;
    }
    return imageObj.image_url || 'https://via.placeholder.com/600';
  };

  if (loading) return <div className="loading-container"><h2>⏳ Loading...</h2></div>;
  if (error) return <div className="error-container"><h2>❌ {error}</h2><Link to="/properties" className="back-btn">← Back</Link></div>;

  return (
    <div className="detail-page">
      <div className="detail-container">
        
        {/* --- HEADER --- */}
        <div className="detail-header">
            <Link to="/properties" className="back-link">← Back</Link>
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <span className={`status-badge ${property.category}`}>{property.category}</span>
                <button onClick={handleWishlistToggle} className="wishlist-btn" title="Add to Wishlist">
                    {isWishlisted ? <FaHeart color="red" size={28} /> : <FaRegHeart color="#ccc" size={28} />}
                </button>
            </div>
        </div>

        <div className="content-wrapper">
            {/* LEFT: IMAGES */}
            <div className="image-section">
                <img 
                    src={property.images && property.images.length > 0 ? getImageUrl(property.images[0]) : 'https://via.placeholder.com/600'} 
                    alt={property.title} className="main-image"
                />
                {property.images && property.images.length > 1 && (
                    <div className="thumbnails">
                        {property.images.slice(1).map((img, idx) => (
                            <img key={idx} src={getImageUrl(img)} alt="thumb" className="thumb-img" />
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: INFO */}
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
                    
                    <button onClick={() => setShowContact(true)} className="contact-btn">
                        📞 Contact Owner
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* 🆕 CONTACT MODAL (POPUP) */}
      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setShowContact(false)}>
                    <FaTimes />
                </button>
                
                <h2>Owner Contact Details</h2>
                <div className="contact-info">
                    <div className="contact-row">
                        <FaUser className="icon-c" />
                        <div>
                            <span>Name</span>
                            <strong>{property.seller_name}</strong>
                        </div>
                    </div>
                    <div className="contact-row">
                        <FaEnvelope className="icon-c" />
                        <div>
                            <span>Email</span>
                            <a href={`mailto:${property.seller_email}`}>{property.seller_email}</a>
                        </div>
                    </div>
                    <div className="contact-row">
                        <FaPhone className="icon-c" />
                        <div>
                            <span>Phone</span>
                            <a href={`tel:${property.seller_phone}`}>{property.seller_phone || "+91 XXXXX XXXXX"}</a>
                        </div>
                    </div>
                </div>
                
                <p className="modal-note">⚠️ Note: Please mention 'UrbanShift' when calling.</p>
            </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetail;