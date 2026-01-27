import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaBed, FaRupeeSign, FaHome } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const PurchasedHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // --- DYNAMIC COLORS ---
  const colors = {
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      shadow: isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.05)',
      priceColor: isDark ? '#ffffff' : '#333333'
  };

  // Smart URL
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

  // ✅ FIX: fetchPurchasedHomes ko useEffect ke andar move kiya
  useEffect(() => {
    const fetchPurchasedHomes = async () => {
      try {
        const token = localStorage.getItem('token');
        // Backend me humne 'my-purchases' endpoint banaya tha
        const res = await axios.get(`${BACKEND_URL}/api/properties/my-purchases/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHomes(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load purchased homes");
        setLoading(false);
      }
    };

    fetchPurchasedHomes();
  }, [BACKEND_URL]); // Dependency added

  const getImageUrl = (imageObj) => {
      if (!imageObj) return "https://via.placeholder.com/400x300?text=No+Image";
      if (imageObj.image) {
          if (imageObj.image.startsWith('http')) return imageObj.image;
          return `${BACKEND_URL}${imageObj.image}`;
      }
      return imageObj.image_url || "https://via.placeholder.com/400x300?text=No+Image";
  };

  // --- STYLES (Moved inside) ---
  const styles = {
      loading: { color: colors.text, textAlign:'center', marginTop:'50px' },
      emptyBox: { textAlign:'center', padding:'40px', background: colors.cardBg, borderRadius:'15px', border: `1px dashed ${colors.border}`, color: colors.subText },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
      card: {
          background: colors.cardBg,
          borderRadius: '15px',
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
          transition: 'transform 0.2s',
          cursor: 'default'
      },
      imageWrapper: { height: '180px', overflow: 'hidden', borderRadius: '12px 12px 0 0', position: 'relative' },
      image: { width: '100%', height: '100%', objectFit: 'cover' },
      soldBadge: {
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#2ecc71',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      },
      content: { padding: '20px' },
      title: { color: colors.text, margin: '0 0 10px 0', fontSize: '1.2rem' },
      location: { display: 'flex', alignItems: 'center', gap: '8px', color: colors.subText, marginBottom: '10px', fontSize: '0.9rem' },
      footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginTop: '10px' },
      price: { color: colors.priceColor, fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center' },
      bed: { color: colors.subText, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }
  };

  if (loading) return <div style={styles.loading}>Loading your homes...</div>;

  if (homes.length === 0) return (
      <div style={styles.emptyBox}>
          <FaHome size={40} color={colors.subText} />
          <h3 style={{marginTop:'10px', color: colors.text}}>No properties purchased yet.</h3>
          <p>Your future home is waiting for you!</p>
      </div>
  );

  return (
    <div style={styles.grid}>
      {homes.map((home) => (
        <div key={home.id} style={styles.card}>
            {/* Image Section */}
            <div style={styles.imageWrapper}>
                <img 
                    src={home.images && home.images.length > 0 ? getImageUrl(home.images[0]) : "https://via.placeholder.com/400x300?text=No+Image"} 
                    alt={home.title}
                    style={styles.image} 
                />
                <div style={styles.soldBadge}>✅ Owned by You</div>
            </div>

            {/* Content */}
            <div style={styles.content}>
                <h3 style={styles.title}>{home.title}</h3>
                
                <div style={styles.location}>
                    <FaMapMarkerAlt color="#f1c40f" /> {home.location}
                </div>

                <div style={styles.footer}>
                    <span style={styles.price}>
                        <FaRupeeSign size={14}/> {parseFloat(home.price).toLocaleString('en-IN')}
                    </span>
                    <span style={styles.bed}>
                        <FaBed /> {home.bedrooms}
                    </span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default PurchasedHomes;