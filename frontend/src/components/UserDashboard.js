import React, { useState } from 'react';
import MyMoves from './MyMoves';
import Wishlist from './Wishlist'; // Wishlist component import karein
import { FaHeart, FaTruck } from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // Default: Bookings

  return (
    <div style={{ padding: '20px', minHeight: '90vh', background: '#121212', color: 'white' }}>
      
      {/* --- DASHBOARD HEADER --- */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#f1c40f' }}>👤 My Dashboard</h2>
        <p style={{ color: '#aaa' }}>Manage your moves and saved homes.</p>
      </div>

      {/* --- TABS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        
        <button 
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 25px',
            background: activeTab === 'bookings' ? '#f1c40f' : '#333',
            color: activeTab === 'bookings' ? 'black' : 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: '0.3s'
          }}
        >
          <FaTruck /> My Bookings
        </button>

        <button 
          onClick={() => setActiveTab('wishlist')}
          style={{
            padding: '10px 25px',
            background: activeTab === 'wishlist' ? '#ff4757' : '#333',
            color: activeTab === 'wishlist' ? 'white' : 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: '0.3s'
          }}
        >
          <FaHeart /> Dream Homes
        </button>

      </div>

      {/* --- CONTENT AREA --- */}
      <div>
        {activeTab === 'bookings' ? <MyMoves /> : <Wishlist />}
      </div>

    </div>
  );
};

export default UserDashboard;