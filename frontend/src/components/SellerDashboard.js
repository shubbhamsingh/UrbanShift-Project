import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCamera, FaUserCircle } from 'react-icons/fa';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // For profile pic upload
  
  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  // 👤 User State 
  const [user, setUser] = useState({
      username: 'Seller',
      is_verified: false 
  });

  // ✅ 3. FUNCTION: Upload Verification Document
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
        const token = localStorage.getItem('token');
        await axios.post(`${BACKEND_URL}/api/users/upload-verification/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success("Document Uploaded! Admin will verify you shortly. 🕒");
        // Reload page to refresh user details
        window.location.reload();
    } catch (error) {
        console.error(error);
        toast.error("Upload Failed! Check connection.");
    }
  };

  // 📸 Profile Picture Upload Handler
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    setUploading(true);
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${BACKEND_URL}/api/users/me/`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success("Profile Picture Updated! 📸");
        window.location.reload(); // Refresh to show new pic
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload image.");
    } finally {
        setUploading(false);
    }
  };

  // ✅ 4. FUNCTION: Delete Property
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const token = localStorage.getItem('token'); 
      await axios.delete(`${BACKEND_URL}/api/properties/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success("Property Deleted! 🗑️");
      setProperties(properties.filter(p => p.id !== id));
      
    } catch (error) {
      toast.error("Failed to delete property.");
    }
  };

  // 🖼️ SMART IMAGE HELPER (FIXED FOR URLS 🛠️)
  const getImageUrl = (imageObj) => {
    if (!imageObj) return 'https://via.placeholder.com/300';
    
    // 1. Agar Backend se direct URL aaya hai (jo ab serializer bhejega)
    if (imageObj.image_url) {
        return imageObj.image_url;
    }

    // 2. Agar Uploaded Image hai
    if (imageObj.image) {
        if (imageObj.image.startsWith('http')) return imageObj.image;
        return `${BACKEND_URL}${imageObj.image}`;
    }
    
    return 'https://via.placeholder.com/300';
  };

  // ✅ FIX: fetchUserDetails and fetchMyProperties moved inside useEffect
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    if (!token) {
        toast.error("Access Denied! Login as Seller.");
        navigate('/login');
        return;
    }

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/me/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            if(error.response && error.response.status === 401){
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };
    
    const fetchMyProperties = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/properties/my-properties/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setProperties(response.data);
        } catch (error) {
          console.error("Error fetching properties:", error);
        } finally {
          setIsLoading(false);
        }
    };

    fetchUserDetails(); 
    fetchMyProperties(); 
  }, [navigate, BACKEND_URL]); // Dependencies added

  return (
    <div style={pageContainerStyle}>
      
      {/* Profile Picture Section */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {user.profile_picture ? (
            <img 
              src={user.profile_picture.startsWith('http') ? user.profile_picture : `${BACKEND_URL}${user.profile_picture}`} 
              alt="Profile" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-orange)' }}
            />
          ) : (
            <FaUserCircle size={100} color="var(--accent-orange)" />
          )}
          <label style={{ 
            position: 'absolute', bottom: '5px', right: '5px', 
            background: '#333', borderRadius: '50%', padding: '8px',
            cursor: 'pointer', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
          }}>
            {uploading ? '...' : <FaCamera size={16} />}
            <input type="file" accept="image/*" onChange={handleProfilePictureUpload} style={{ display: 'none' }} />
          </label>
        </div>
        <h2 style={{ margin: '10px 0 5px', color: 'var(--text-primary)' }}>{user.username}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{user.email || 'seller@urbanshift.com'}</p>
      </div>

      {/* --- HEADER SECTION --- */}
      <div style={headerStyle}>
        <div>
            <h2 style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                👋 Welcome, {user.username} 
                {user.is_verified ? (
                    <span style={{fontSize:'0.8rem', background:'green', color:'white', padding:'2px 8px', borderRadius:'10px'}}>✅ Verified</span>
                ) : (
                    <span style={{fontSize:'0.8rem', background:'red', color:'white', padding:'2px 8px', borderRadius:'10px'}}>❌ Not Verified</span>
                )}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Manage your properties and profile.</p>
        </div>
        
        <Link to="/add-property" style={{...addBtnStyle, opacity: user.is_verified ? 1 : 0.5, pointerEvents: user.is_verified ? 'auto' : 'none'}}>
            ➕ Post New Property
        </Link>
      </div>

      {/* --- WARNING BOX --- */}
      {!user.is_verified && (
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', margin: '0 0 30px 0', borderRadius: '8px', border: '1px solid #ffeeba', color: '#856404' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Action Required: Verify Account</h3>
            <p style={{ margin: 0 }}>You must verify your account before posting properties.</p>
            
            <div style={{ marginTop: '15px', display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                <label style={{fontWeight:'bold'}}>Upload ID Proof (Aadhar/PAN): </label>
                <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
            </div>
            {user.verification_document && <p style={{fontSize:'0.8rem', marginTop:'5px', color:'blue'}}>* Document already uploaded. Status: Under Review.</p>}
        </div>
      )}

      {/* --- STATS SECTION --- */}
      <div style={statsContainerStyle}>
        <div style={cardStyle}>
            <h3 style={{margin:0, color:'var(--accent-orange)'}}>{properties.length}</h3>
            <p style={{color:'var(--text-secondary)'}}>Active Listings</p>
        </div>
      </div>

      <h3 style={{ color: 'var(--text-primary)', marginTop: '30px' }}>🏠 Your Properties</h3>
      
      {isLoading ? (
        <p style={{color:'var(--text-secondary)'}}>Loading...</p>
      ) : properties.length === 0 ? (
        <div style={emptyStateStyle}>
            <span style={{fontSize: '3rem'}}>🏚️</span>
            <h4 style={{color:'var(--text-primary)', marginTop:'10px'}}>No properties listed yet.</h4>
            {user.is_verified && <Link to="/add-property" style={{...addBtnStyle, background:'var(--accent-teal)', marginTop:'15px'}}>Post Now</Link>}
        </div>
      ) : (
        // ✅ PROPERTIES GRID (Images Fixed)
        <div style={gridStyle}>
            {properties.map((property) => (
                <div key={property.id} style={propertyCardStyle}>
                    <img 
                        src={property.images && property.images.length > 0 
                            ? getImageUrl(property.images[0])
                            : 'https://via.placeholder.com/300'} 
                        alt={property.title} 
                        style={imageStyle} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                    />
                    <div style={{padding: '15px'}}>
                        <h4 style={{margin: '0 0 10px 0', color: 'var(--text-primary)'}}>{property.title}</h4>
                        <p style={{color: 'var(--accent-teal)', fontWeight:'bold'}}>₹{parseFloat(property.price).toLocaleString('en-IN')}/mo</p>
                        <p style={{color: 'var(--text-secondary)', fontSize:'0.9rem'}}>📍 {property.location}</p>
                        
                        <button 
                            onClick={() => handleDelete(property.id)} 
                            style={deleteBtnStyle}
                        >
                            Delete 🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const pageContainerStyle = { padding: '40px', background: 'var(--bg-color)', minHeight: '90vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' };
const addBtnStyle = { textDecoration: 'none', background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)', color: 'white', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(255, 94, 98, 0.4)' };
const statsContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' };
const cardStyle = { background: 'var(--card-bg)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const emptyStateStyle = { textAlign: 'center', padding: '50px', border: '2px dashed var(--border-color)', borderRadius: '20px', background: 'var(--card-bg)', marginTop: '20px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const propertyCardStyle = { background: 'var(--card-bg)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const imageStyle = { width: '100%', height: '180px', objectFit: 'cover' };
const deleteBtnStyle = { width: '100%', padding: '8px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };

export default SellerDashboard;