import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle between View & Edit

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '' // Optional change
  });

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        phone: res.data.phone || '',
        password: ''
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Password agar empty hai to use mat bhejo (Backend handle karega)
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      const res = await axios.patch(`${BACKEND_URL}/api/users/me/`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      setIsEditing(false); // Wapas View Mode me jao
      toast.success("Profile Updated Successfully! 🎉");
    } catch (error) {
      console.error(error);
      // Agar backend se validation error aaye (jaise password weak)
      if (error.response && error.response.data) {
         // Pehla error message dikhao
         const firstError = Object.values(error.response.data).flat()[0];
         toast.error(firstError || "Update Failed");
      } else {
         toast.error("Failed to update profile.");
      }
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Loading Profile...</div>;

  return (
    <div style={containerStyle}>
      
      {!isEditing ? (
        /* --- CARD 1: VIEW PROFILE --- */
        <div style={cardStyle}>
          <div style={avatarContainer}>
             <FaUser size={40} color="#fff" />
          </div>
          
          <h2 style={{color: 'white', marginTop: '15px'}}>{user.username}</h2>
          <span style={roleBadge}>{user.user_type}</span>

          <div style={infoContainer}>
             <div style={infoRow}>
                <FaEnvelope color="#f1c40f" /> <span>{user.email}</span>
             </div>
             <div style={infoRow}>
                <FaPhone color="#f1c40f" /> <span>{user.phone || "No phone added"}</span>
             </div>
          </div>

          <button onClick={() => setIsEditing(true)} style={editBtnStyle}>
             <FaEdit /> Edit Profile
          </button>
        </div>
      ) : (
        /* --- CARD 2: EDIT PROFILE --- */
        <div style={cardStyle}>
           <div style={{display:'flex', justifyContent:'space-between', width:'100%', marginBottom:'20px'}}>
              <h3 style={{color:'white', margin:0}}>✏️ Edit Profile</h3>
              <FaTimes onClick={() => setIsEditing(false)} style={{cursor:'pointer', color:'#888'}} />
           </div>

           <form onSubmit={handleSubmit} style={{width:'100%'}}>
              
              <div style={inputGroup}>
                 <label>Full Name</label>
                 <div style={inputWrapper}>
                    <FaUser color="#888" style={iconStyle}/>
                    <input name="username" value={formData.username} onChange={handleChange} style={inputStyle} />
                 </div>
              </div>

              <div style={inputGroup}>
                 <label>Phone Number</label>
                 <div style={inputWrapper}>
                    <FaPhone color="#888" style={iconStyle}/>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91..." style={inputStyle} />
                 </div>
              </div>

              <div style={inputGroup}>
                 <label>New Password <small style={{color:'#666'}}>(Optional)</small></label>
                 <div style={inputWrapper}>
                    <FaLock color="#888" style={iconStyle}/>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep same" style={inputStyle} />
                 </div>
              </div>

              <button type="submit" style={saveBtnStyle}>
                 <FaSave /> Save Changes
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

// --- STYLES (Minimalistic 3D Look) ---
const containerStyle = {
  minHeight: '85vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#121212',
  padding: '20px'
};

const cardStyle = {
  background: 'linear-gradient(145deg, #1e1e1e, #252525)', // Subtle gradient
  width: '100%',
  maxWidth: '400px',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '10px 10px 30px #0a0a0a, -10px -10px 30px #2a2a2a', // 3D Neumorphism Shadow
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid #333',
  transition: '0.3s ease-in-out'
};

const avatarContainer = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF9966, #FF5E62)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)'
};

const roleBadge = {
  background: '#333',
  color: '#ccc',
  padding: '4px 12px',
  borderRadius: '15px',
  fontSize: '0.8rem',
  marginTop: '5px',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const infoContainer = {
  width: '100%',
  marginTop: '30px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const infoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  color: '#ddd',
  background: '#181818',
  padding: '12px',
  borderRadius: '10px',
  fontSize: '0.95rem'
};

const editBtnStyle = {
  marginTop: '30px',
  width: '100%',
  padding: '12px',
  background: 'transparent',
  border: '1px solid #f1c40f',
  color: '#f1c40f',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  transition: '0.3s'
};

const saveBtnStyle = {
  marginTop: '20px',
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(135deg, #FF9966, #FF5E62)',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)'
};

// Form Styles
const inputGroup = { marginBottom: '15px', width: '100%' };
const inputWrapper = { display: 'flex', alignItems: 'center', background: '#121212', borderRadius: '8px', padding: '0 10px', border: '1px solid #333' };
const inputStyle = { width: '100%', padding: '12px', background: 'transparent', border: 'none', color: 'white', outline: 'none' };
const iconStyle = { marginRight: '10px' };

export default Profile;