import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Upload ke liye axios chahiye

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null); // File state

  useEffect(() => {
    // User ka latest data fetch karna behtar rahega
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.user_type !== 'SELLER') {
      navigate('/'); 
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  // --- Handle Document Upload ---
  const handleVerify = async () => {
    if(!file) return alert("Please select a document first (Aadhaar/Bill)");

    const formData = new FormData();
    formData.append('verification_document', file);
    // Real logic me yahan API call hogi: 
    // await axios.patch(`https://urbanshift-project.onrender.com/api/users/${user.id}/`, formData)
    
    alert("Document Uploaded! Admin will verify shortly. (Simulation)");
    // Demo ke liye local state change kar rahe hain:
    setUser({...user, is_verified: true}); 
  };

  return (
    <div style={containerStyle}>
      {/* --- HEADER SECTION --- */}
      <div style={headerCardStyle}>
        <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', display:'flex', alignItems:'center', gap:'10px' }}>
                👋 Welcome, {user.username}
                {/* --- VERIFICATION BADGE LOGIC --- */}
                {user.is_verified ? (
                    <span title="Verified Seller" style={{fontSize:'1.5rem'}}>✅</span>
                ) : (
                    <span style={unverifiedBadgeStyle}>Unverified ⚠️</span>
                )}
            </h2>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Manage your properties and check lead stats.</p>
        </div>
        <div>
            <Link to="/add-property" style={primaryBtnStyle}>
                ➕ Post New Property
            </Link>
        </div>
      </div>

      {/* --- VERIFICATION WARNING (Agar Unverified hai to ye dikhega) --- */}
      {!user.is_verified && (
        <div style={warningCardStyle}>
            <div style={{flex: 1}}>
                <h4 style={{margin:'0 0 5px 0'}}>🚀 Get Your Blue Tick!</h4>
                <p style={{margin:0, fontSize:'0.9rem', opacity:0.8}}>Upload Aadhaar or Electricity Bill to become a Trusted Seller.</p>
            </div>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{fontSize:'0.9rem'}} />
                <button onClick={handleVerify} style={verifyBtnStyle}>Submit for Verification</button>
            </div>
        </div>
      )}

      {/* --- STATS SECTION (Cards) --- */}
      <div style={statsGridStyle}>
        <div style={cardStyle}>
            <div style={iconStyle}>🏠</div>
            <h3>0</h3>
            <p>Active Listings</p>
        </div>
        <div style={cardStyle}>
            <div style={iconStyle}>👁️</div>
            <h3>0</h3>
            <p>Total Views</p>
        </div>
        <div style={cardStyle}>
            <div style={iconStyle}>📩</div>
            <h3>0</h3>
            <p>Interested Tenants</p>
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      <h3 style={{ marginTop: '40px', color: 'var(--text-primary)' }}>Your Properties</h3>
      <div style={emptyStateStyle}>
        <img src="https://cdn-icons-png.flaticon.com/512/6009/6009864.png" alt="No House" style={{ width: '80px', opacity: 0.5, marginBottom: '20px' }} />
        <h4 style={{ margin: '0 0 10px 0' }}>No properties listed yet</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Upload your property details to start getting tenants.</p>
        <Link to="/add-property" style={{ color: 'var(--accent-orange)', fontWeight: 'bold', textDecoration: 'none' }}>
            Start Listing Now ➔
        </Link>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' };

const headerCardStyle = {
  background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
  color: 'white', padding: '40px', borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(255, 94, 98, 0.3)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px'
};

// New Styles for Verification
const unverifiedBadgeStyle = {
    background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '20px',
    fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.5)'
};

const warningCardStyle = {
    background: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '15px',
    border: '1px solid #ffeeba', marginBottom: '30px', display: 'flex', 
    alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap:'15px'
};

const verifyBtnStyle = {
    background: '#856404', color: 'white', border: 'none', padding: '8px 15px',
    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
};

const primaryBtnStyle = {
  background: 'white', color: '#FF5E62', padding: '12px 28px', textDecoration: 'none',
  borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', display: 'inline-block'
};

const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', padding: '0' };

const cardStyle = { background: 'var(--card-bg)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', border: '1px solid var(--border-color)' };
const iconStyle = { fontSize: '2.5rem', marginBottom: '10px' };
const emptyStateStyle = { padding: '60px', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '15px', border: '2px dashed var(--border-color)', marginTop: '20px' };

export default SellerDashboard;