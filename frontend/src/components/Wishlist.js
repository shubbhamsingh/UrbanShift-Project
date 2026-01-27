import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      priceColor: isDark ? '#2ecc71' : '#27ae60'
  };

  // Live Backend URL
  const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.warning("Please login to see your DreamHome! 🔒");
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/api/properties/wishlist/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        if(err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, BACKEND_URL]);

  const handleRemove = async (propertyId) => {
    const token = localStorage.getItem('token');
    try {
        await axios.post(`${BACKEND_URL}/api/properties/${propertyId}/toggle-wishlist/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setWishlist(wishlist.filter(item => item.property.id !== propertyId));
        toast.info("Removed from DreamHome 💔");

    } catch (err) {
        console.error(err);
        toast.error("Could not remove item.");
    }
  };

  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    if (imageObj.image_url) return imageObj.image_url;
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `${BACKEND_URL}${imageObj.image}`;
    }
    return 'https://via.placeholder.com/300';
  };

  // --- STYLES (Moved inside) ---
  const styles = {
      page: { padding: '40px 20px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s' },
      title: { textAlign: 'center', marginBottom: '40px', color: '#f1c40f' },
      loading: { textAlign:'center', marginTop:'50px', color: colors.text },
      emptyBox: { textAlign:'center', padding:'50px', border:`1px dashed ${colors.border}`, borderRadius:'15px', color: colors.subText },
      exploreBtn: { marginTop:'20px', display:'inline-block', padding:'12px 25px', background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color:'white', borderRadius:'8px', textDecoration:'none', fontWeight:'bold' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
      card: { 
          background: colors.cardBg, 
          borderRadius: '15px', 
          overflow: 'hidden', 
          border: `1px solid ${colors.border}`, 
          boxShadow: colors.shadow,
          display: 'flex', flexDirection: 'column'
      },
      imageWrapper: { height: '200px', position: 'relative' },
      image: { width: '100%', height: '100%', objectFit: 'cover' },
      categoryTag: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' },
      content: { padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' },
      propTitle: { fontSize: '1.2rem', margin: '0 0 10px 0', color: colors.text },
      price: { fontSize: '1.1rem', color: colors.priceColor, fontWeight: 'bold', display: 'flex', alignItems: 'center' },
      location: { color: colors.subText, fontSize: '0.9rem', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '5px' },
      actions: { marginTop: 'auto', display: 'flex', gap: '10px' },
      viewBtn: { flex: 1, textAlign: 'center', padding: '10px', border: `1px solid ${colors.border}`, color: colors.text, textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' },
      removeBtn: { padding: '10px', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  if (loading) return <div style={styles.loading}><h2>⏳ Loading your DreamHome...</h2></div>;

  return (
    <div style={styles.page}>
        <h1 style={styles.title}>My DreamHome Collection ❤️</h1>
        
        {wishlist.length === 0 ? (
            <div style={styles.emptyBox}>
                <h2>Your collection is empty. 😕</h2>
                <p>Start exploring and save homes you like!</p>
                <Link to="/properties" style={styles.exploreBtn}>🏠 Find Homes</Link>
            </div>
        ) : (
            <div style={styles.grid}>
                {wishlist.map((item) => (
                    <div key={item.id} style={styles.card}>
                        <div style={styles.imageWrapper}>
                            <img 
                                src={item.property.images && item.property.images.length > 0 
                                    ? getImageUrl(item.property.images[0]) 
                                    : 'https://via.placeholder.com/300'} 
                                alt={item.property.title} 
                                style={styles.image}
                            />
                            <span style={styles.categoryTag}>{item.property.category}</span>
                        </div>
                        
                        <div style={styles.content}>
                            <h3 style={styles.propTitle}>{item.property.title}</h3>
                            <p style={styles.price}><FaRupeeSign size={14}/> {parseFloat(item.property.price).toLocaleString('en-IN')}</p>
                            <p style={styles.location}><FaMapMarkerAlt /> {item.property.location}</p>
                            
                            <div style={styles.actions}>
                                <Link to={`/properties/${item.property.id}`} style={styles.viewBtn}>
                                    View Details
                                </Link>
                                <button onClick={() => handleRemove(item.property.id)} style={styles.removeBtn}>
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