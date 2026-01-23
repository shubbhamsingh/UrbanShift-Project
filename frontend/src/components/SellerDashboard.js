import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 👤 User State (Verification status check karne ke liye)
  const [user, setUser] = useState({
      username: 'Seller',
      is_verified: false // Default false hai, taaki box dikhe agar API fail ho
  });

  // ✅ 1. FUNCTION: Fetch User Details (Status check karne ke liye)
  const fetchUserDetails = async () => {
    try {
        // 👇 FIX: 'access_token' ki jagah 'token' kiya
        const token = localStorage.getItem('token'); 
        if (!token) return;

        const response = await axios.get('http://127.0.0.1:8000/api/users/me/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
  };

  // ✅ 2. FUNCTION: Fetch Properties
  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem('token'); // 👇 FIX
      const response = await axios.get('http://127.0.0.1:8000/api/properties/my-properties/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 3. FUNCTION: Upload Verification Document
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
        const token = localStorage.getItem('token'); // 👇 FIX
        await axios.post('http://127.0.0.1:8000/api/users/upload-verification/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success("Document Uploaded! Admin will verify you shortly. 🕒");
        // Reload user details to update UI if needed
        fetchUserDetails();
    } catch (error) {
        console.error(error);
        toast.error("Upload Failed! Check connection.");
    }
  };

  // ✅ 4. FUNCTION: Delete Property
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const token = localStorage.getItem('token'); // 👇 FIX
      await axios.delete(`http://127.0.0.1:8000/api/properties/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success("Property Deleted! 🗑️");
      setProperties(properties.filter(p => p.id !== id));
      
    } catch (error) {
      toast.error("Failed to delete property.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // 👇 FIX
    const userType = localStorage.getItem('userType'); // Optional check
    
    if (!token) {
        toast.error("Access Denied! Login as Seller.");
        navigate('/login');
        return;
    }

    fetchUserDetails(); // User info laao (Yellow box logic ke liye)
    fetchMyProperties(); // Properties laao

  }, [navigate]);

  return (
    <div style={pageContainerStyle}>
      
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
        
        {/* Post Button Logic: Sirf verified user hi click kar payega */}
        <Link to="/add-property" style={{...addBtnStyle, opacity: user.is_verified ? 1 : 0.5, pointerEvents: user.is_verified ? 'auto' : 'none'}}>
            ➕ Post New Property
        </Link>
      </div>

      {/* --- ⚠️ YELLOW BOX: VERIFICATION WARNING (Agar Verified Nahi hai) --- */}
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
        // ✅ PROPERTIES GRID
        <div style={gridStyle}>
            {properties.map((property) => (
                <div key={property.id} style={propertyCardStyle}>
                    <img 
                        src={property.images && property.images.length > 0 
                                ? (property.images[0].image ? `http://127.0.0.1:8000${property.images[0].image}` : property.images[0].image_url)
                                : 'https://via.placeholder.com/300'} 
                        alt={property.title} 
                        style={imageStyle} 
                    />
                    <div style={{padding: '15px'}}>
                        <h4 style={{margin: '0 0 10px 0', color: 'var(--text-primary)'}}>{property.title}</h4>
                        <p style={{color: 'var(--accent-teal)', fontWeight:'bold'}}>₹{property.price}/mo</p>
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