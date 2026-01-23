import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './wishlist.css'; // CSS Import

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Data Fetch karna
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.warning("Please login to see your DreamHome! 🔒");
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/properties/wishlist/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        // Agar token invalid hai to logout kar do
        if(err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  // 🗑️ Remove Item Function
  const handleRemove = async (propertyId) => {
    const token = localStorage.getItem('token');
    try {
        await axios.post(`http://127.0.0.1:8000/api/properties/${propertyId}/toggle-wishlist/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // List update karo (Jo remove hua use filter kar do)
        setWishlist(wishlist.filter(item => item.property.id !== propertyId));
        toast.info("Removed from DreamHome 💔");

    } catch (err) {
        console.error(err);
        toast.error("Could not remove item.");
    }
  };

  // 🖼️ Image Helper
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `http://127.0.0.1:8000${imageObj.image}`;
    }
    return imageObj.image_url || 'https://via.placeholder.com/300';
  };

  if (loading) return <div className="loading-container"><h2>⏳ Loading your DreamHome...</h2></div>;

  return (
    <div className="wishlist-page">
        <h1 className="page-title">My DreamHome Collection ❤️</h1>
        
        {wishlist.length === 0 ? (
            <div className="empty-wishlist">
                <h2>Your collection is empty. 😕</h2>
                <p>Start exploring and save homes you like!</p>
                <Link to="/properties" className="btn-explore">🏠 Find Homes</Link>
            </div>
        ) : (
            <div className="wishlist-grid">
                {wishlist.map((item) => (
                    <div key={item.id} className="wishlist-card">
                        <div className="card-img-wrapper">
                            <img 
                                src={item.property.images && item.property.images.length > 0 
                                    ? getImageUrl(item.property.images[0]) 
                                    : 'https://via.placeholder.com/300'} 
                                alt={item.property.title} 
                            />
                            <span className="category-tag">{item.property.category}</span>
                        </div>
                        
                        <div className="card-content">
                            <h3>{item.property.title}</h3>
                            <p className="price">₹{item.property.price}</p>
                            <p className="location">📍 {item.property.location}</p>
                            
                            <div className="action-buttons">
                                <Link to={`/property/${item.property.id}`} className="view-btn-small">
                                    View Details
                                </Link>
                                <button onClick={() => handleRemove(item.property.id)} className="remove-btn">
                                    ❌ Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default Wishlist;