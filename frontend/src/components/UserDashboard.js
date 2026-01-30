import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import MyMoves from './MyMoves';
import Wishlist from './Wishlist';
import PurchasedHomes from './PurchasedHomes';
import { FaHeart, FaTruck, FaHistory, FaHome, FaBoxOpen, FaCamera, FaUserCircle } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const UserDashboard = () => {
  const [searchParams] = useSearchParams(); // 👈 Read URL params
  const tabParam = searchParams.get('tab'); // ?tab=history
  const [activeTab, setActiveTab] = useState(tabParam === 'history' ? 'history' : 'ongoing');
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate(); 
  
  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";

  // Fetch User Data on Mount
  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
    } catch (error) {
        console.error("Error fetching user data", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    setUploading(true);
    try {
        const token = localStorage.getItem('token');
        const res = await axios.patch(`${BACKEND_URL}/api/users/me/`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        setUserData(res.data); // Update UI immediately
        toast.success("Profile Picture Updated! 📸");
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload image.");
    } finally {
        setUploading(false);
    }
  };

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      text: isDark ? 'white' : '#333333',
      subText: isDark ? '#888' : '#666',
      border: isDark ? '#333' : '#ddd',
      card: isDark ? '#1e1e1e' : 'white',
      
      // Tabs Colors
      tabActiveBg: '#f1c40f',
      tabActiveText: 'black',
      tabInactiveBg: isDark ? '#2c3e50' : '#e0e0e0',
      tabInactiveText: isDark ? '#ccc' : '#555'
  };

  return (
    <div style={{ padding: '30px', minHeight: '90vh', background: colors.bg, color: colors.text, transition: '0.3s' }}>
      
      {/* --- HEADER PROFILE SECTION --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px', background: colors.card, padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
        
        {/* AVATAR UPLOAD */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
            <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
                border: '4px solid #f1c40f', background: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                {userData?.profile_picture ? (
                    <img src={userData.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <FaUserCircle size={100} color="#fff" />
                )}
            </div>
            
            {/* Camera Icon Overlay */}
            <label style={{
                position: 'absolute', bottom: '5px', right: '5px', background: '#333', color: 'white', 
                borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: 'pointer', border: '2px solid white'
            }}>
                {uploading ? <span style={{fontSize:'10px'}}>...</span> : <FaCamera size={14} />}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
            </label>
        </div>

        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>
            {userData?.username || 'User'}
        </h2>
        <p style={{ color: colors.subText, margin: 0 }}>{userData?.email}</p>
        
        {/* NEW: BOOK MOVERS BUTTON */}
        <button 
            onClick={() => navigate('/packers-movers')}
            style={{
                marginTop: '20px', padding: '12px 25px', background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 5px 15px rgba(52, 152, 219, 0.4)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
            <FaBoxOpen size={20} /> Book Packers & Movers
        </button>
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div style={{...tabContainerStyle, borderBottom: `1px solid ${colors.border}`}}>
        <TabButton isActive={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')} icon={<FaTruck />} label="Current Bookings" colors={colors} />
        <TabButton isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<FaHistory />} label="Booking History" colors={colors} />
        <TabButton isActive={activeTab === 'purchased'} onClick={() => setActiveTab('purchased')} icon={<FaHome />} label="Purchased Homes" colors={colors} />
        <TabButton isActive={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} icon={<FaHeart />} label="Dream Homes" colors={colors} />
      </div>

      {/* --- CONTENT AREA --- */}
      <div style={{ marginTop: '30px' }}>
        {activeTab === 'ongoing' && <MyMoves filterType="ongoing" />}
        {activeTab === 'history' && <MyMoves filterType="history" />}
        {activeTab === 'purchased' && <PurchasedHomes />}
        {activeTab === 'wishlist' && <Wishlist />}
      </div>

    </div>
  );
};

// --- Reusable Tab Button ---
const TabButton = ({ isActive, onClick, icon, label, colors }) => (
    <button 
      onClick={onClick}
      style={{
        padding: '12px 25px', background: isActive ? colors.tabActiveBg : colors.tabInactiveBg,
        color: isActive ? colors.tabActiveText : colors.tabInactiveText, border: 'none', borderRadius: '50px',
        cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.3s ease', boxShadow: isActive ? '0 4px 15px rgba(241, 196, 15, 0.4)' : 'none',
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {icon} {label}
    </button>
);

const tabContainerStyle = { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', paddingBottom: '20px' };

export default UserDashboard;