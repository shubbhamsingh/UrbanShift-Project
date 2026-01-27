import React, { useState, useContext } from 'react';
import MyMoves from './MyMoves';
import Wishlist from './Wishlist';
import PurchasedHomes from './PurchasedHomes';
import { FaHeart, FaTruck, FaHistory, FaHome } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  
  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      text: isDark ? 'white' : '#333333',
      subText: isDark ? '#888' : '#666',
      border: isDark ? '#333' : '#ddd',
      
      // Tabs Colors
      tabActiveBg: '#f1c40f',
      tabActiveText: 'black',
      tabInactiveBg: isDark ? '#2c3e50' : '#e0e0e0', // Light mode me grey button
      tabInactiveText: isDark ? '#ccc' : '#555'
  };

  return (
    <div style={{ padding: '30px', minHeight: '90vh', background: colors.bg, color: colors.text, transition: '0.3s' }}>
      
      {/* --- HEADER --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', background: 'linear-gradient(to right, #f1c40f, #f39c12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            User Dashboard
        </h2>
        <p style={{ color: colors.subText, marginTop: '10px' }}>Manage your bookings, purchases, and wishlist.</p>
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div style={{...tabContainerStyle, borderBottom: `1px solid ${colors.border}`}}>
        
        <TabButton 
            isActive={activeTab === 'ongoing'} 
            onClick={() => setActiveTab('ongoing')} 
            icon={<FaTruck />} 
            label="Current Bookings" 
            colors={colors} // ✅ Pass colors prop
        />

        <TabButton 
            isActive={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<FaHistory />} 
            label="Booking History" 
            colors={colors}
        />

        <TabButton 
            isActive={activeTab === 'purchased'} 
            onClick={() => setActiveTab('purchased')} 
            icon={<FaHome />} 
            label="Purchased Homes" 
            colors={colors}
        />

        <TabButton 
            isActive={activeTab === 'wishlist'} 
            onClick={() => setActiveTab('wishlist')} 
            icon={<FaHeart />} 
            label="Dream Homes" 
            colors={colors}
        />
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

// --- Reusable Tab Button (Updated with Dynamic Colors) ---
const TabButton = ({ isActive, onClick, icon, label, colors }) => (
    <button 
      onClick={onClick}
      style={{
        padding: '12px 25px',
        background: isActive ? colors.tabActiveBg : colors.tabInactiveBg,
        color: isActive ? colors.tabActiveText : colors.tabInactiveText,
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 15px rgba(241, 196, 15, 0.4)' : 'none',
        transform: isActive ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {icon} {label}
    </button>
);

const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    paddingBottom: '20px'
};

export default UserDashboard;