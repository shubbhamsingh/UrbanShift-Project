import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const BookMovers = () => {
  const navigate = useNavigate();

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Field names wahi hain jo Django Models me hain
  const [formData, setFormData] = useState({
    source: '',           
    destination: '',      
    move_date: '',        
    move_size: '1BHK',    
    items_list: ''        
  });

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error("Please Login to book movers! 🚚");
        navigate('/login');
        return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/relocation/move-requests/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success("Request Sent! Check status in 'My Bookings' ✅");
      navigate('/user-dashboard'); // Dashboard par bhej diya
    } catch (error) {
      console.error("Submission Error:", error.response?.data);
      
      if (error.response && error.response.data) {
          const errorMsg = Object.values(error.response.data).flat().join(', ');
          toast.error(`Error: ${errorMsg}`);
      } else {
          toast.error("Failed to send request. Try again.");
      }
    }
  };

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#bbbbbb' : '#666666',
      inputBg: isDark ? '#2c2c2c' : '#f9f9f9',
      border: isDark ? '#333' : '#ddd',
      shadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
      icon: isDark ? '#FF9966' : '#FF5E62'
  };

  // --- STYLES (Moved inside) ---
  const styles = {
    container: { 
        padding: '40px 20px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: colors.bg, 
        minHeight:'90vh',
        transition: '0.3s'
    },
    formCard: { 
        width: '100%', 
        maxWidth: '550px', 
        background: colors.cardBg, 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: colors.shadow, 
        border: `1px solid ${colors.border}`,
        transition: '0.3s'
    },
    header: { 
        color: colors.text, 
        textAlign:'center', 
        fontSize: '1.8rem', 
        marginBottom: '10px' 
    },
    subHeader: { 
        textAlign:'center', 
        color: colors.subText, 
        marginBottom:'30px', 
        fontSize: '0.95rem' 
    },
    inputGroup: { 
        marginBottom: '20px', 
        display:'flex', 
        flexDirection:'column', 
        gap:'8px', 
        color: colors.text, 
        fontWeight:'600' 
    },
    labelIcon: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: colors.subText, 
        fontSize: '0.9rem' 
    },
    rowStyle: { display:'flex', gap:'20px', marginBottom:'20px' },
    
    input: { 
        padding: '14px', 
        borderRadius: '10px', 
        border: `1px solid ${colors.border}`, 
        background: colors.inputBg, 
        color: colors.text, 
        outline: 'none',
        fontSize: '1rem',
        transition: '0.3s'
    },
    
    btn: { 
        width: '100%', 
        padding: '16px', 
        background: 'linear-gradient(135deg, #FF9966, #FF5E62)', 
        color: 'white', 
        border: 'none', 
        borderRadius: '12px', 
        fontSize: '1.1rem', 
        cursor: 'pointer', 
        fontWeight:'bold', 
        marginTop:'20px',
        boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)',
        transition: 'transform 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.header}>
            <FaTruck color={colors.icon} style={{marginRight: '10px'}}/> 
            Book Packers & Movers
        </h2>
        <p style={styles.subHeader}>Get verified movers for a hassle-free shift.</p>
        
        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <div style={styles.labelIcon}><FaMapMarkerAlt /> Moving From (Source)</div>
            <input 
                name="source" 
                type="text" 
                placeholder="e.g. Malviya Nagar, Jaipur" 
                onChange={handleChange} 
                required 
                style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelIcon}><FaMapMarkerAlt /> Moving To (Destination)</div>
            <input 
                name="destination" 
                type="text" 
                placeholder="e.g. Whitefield, Bangalore" 
                onChange={handleChange} 
                required 
                style={styles.input} 
            />
          </div>

          <div style={styles.rowStyle}>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                <div style={styles.labelIcon}><FaCalendarAlt /> Move Date</div>
                <input 
                    name="move_date" 
                    type="date" 
                    onChange={handleChange} 
                    required 
                    style={styles.input} 
                />
            </div>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                <div style={styles.labelIcon}><FaBoxOpen /> House Size</div>
                <select name="move_size" onChange={handleChange} style={styles.input}>
                    <option>1BHK</option>
                    <option>2BHK</option>
                    <option>3BHK</option>
                    <option>Villa/Bungalow</option>
                    <option>Office</option>
                </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelIcon}>List Major Items (Optional)</div>
            <textarea 
                name="items_list" 
                rows="4" 
                placeholder="e.g. 1 Bed, 1 Fridge, 2 ACs..." 
                onChange={handleChange} 
                style={{...styles.input, resize: 'vertical'}}
            ></textarea>
          </div>

          <button 
            type="submit" 
            style={styles.btn}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🚀 Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookMovers;