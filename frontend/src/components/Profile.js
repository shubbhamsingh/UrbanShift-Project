import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle between View & Edit

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '' 
  });

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  // ✅ FIX: fetchProfile ko useEffect ke andar move kiya
  useEffect(() => {
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

    fetchProfile();
  }, [BACKEND_URL]); // Dependency added

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      const res = await axios.patch(`${BACKEND_URL}/api/users/me/`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      setIsEditing(false); 
      toast.success("Profile Updated Successfully! 🎉");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
         const firstError = Object.values(error.response.data).flat()[0];
         toast.error(firstError || "Update Failed");
      } else {
         toast.error("Failed to update profile.");
      }
    }
  };

  // --- DYNAMIC THEME COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? 'linear-gradient(145deg, #1e1e1e, #252525)' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#cccccc' : '#555555',
      rowBg: isDark ? '#181818' : '#f9f9f9', // Info row background
      inputBg: isDark ? '#121212' : '#f0f2f5',
      border: isDark ? '#333' : '#e0e0e0',
      iconColor: isDark ? '#888' : '#666',
      shadow: isDark 
        ? '10px 10px 30px #0a0a0a, -10px -10px 30px #2a2a2a' 
        : '0 10px 40px rgba(0,0,0,0.08)'
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '85vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: colors.bg,
      padding: '20px',
      transition: '0.3s'
    },
    card: {
      background: colors.cardBg,
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: colors.shadow,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: `1px solid ${colors.border}`,
      transition: '0.3s ease-in-out'
    },
    avatarContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF9966, #FF5E62)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 15px rgba(255, 94, 98, 0.4)'
    },
    roleBadge: {
      background: isDark ? '#333' : '#e0e0e0',
      color: colors.subText,
      padding: '4px 12px',
      borderRadius: '15px',
      fontSize: '0.8rem',
      marginTop: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    infoContainer: {
      width: '100%',
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      color: colors.text,
      background: colors.rowBg,
      padding: '12px',
      borderRadius: '10px',
      fontSize: '0.95rem',
      border: `1px solid ${colors.border}`
    },
    editBtn: {
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
    },
    saveBtn: {
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
    },
    inputGroup: { marginBottom: '15px', width: '100%' },
    inputWrapper: { 
        display: 'flex', 
        alignItems: 'center', 
        background: colors.inputBg, 
        borderRadius: '8px', 
        padding: '0 10px', 
        border: `1px solid ${colors.border}` 
    },
    input: { 
        width: '100%', 
        padding: '12px', 
        background: 'transparent', 
        border: 'none', 
        color: colors.text, 
        outline: 'none' 
    },
    label: {
        color: colors.subText,
        marginBottom: '5px',
        display: 'block',
        fontSize: '0.9rem'
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px', color: colors.text}}>Loading Profile...</div>;

  return (
    <div style={styles.container}>
      
      {!isEditing ? (
        /* --- CARD 1: VIEW PROFILE --- */
        <div style={styles.card}>
          <div style={styles.avatarContainer}>
             <FaUser size={40} color="#fff" />
          </div>
          
          <h2 style={{color: colors.text, marginTop: '15px'}}>{user.username}</h2>
          <span style={styles.roleBadge}>{user.user_type}</span>

          <div style={styles.infoContainer}>
             <div style={styles.infoRow}>
                <FaEnvelope color="#f1c40f" /> <span>{user.email}</span>
             </div>
             <div style={styles.infoRow}>
                <FaPhone color="#f1c40f" /> <span>{user.phone || "No phone added"}</span>
             </div>
          </div>

          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
             <FaEdit /> Edit Profile
          </button>
        </div>
      ) : (
        /* --- CARD 2: EDIT PROFILE --- */
        <div style={styles.card}>
           <div style={{display:'flex', justifyContent:'space-between', width:'100%', marginBottom:'20px'}}>
              <h3 style={{color: colors.text, margin:0}}>✏️ Edit Profile</h3>
              <FaTimes onClick={() => setIsEditing(false)} style={{cursor:'pointer', color: colors.subText}} />
           </div>

           <form onSubmit={handleSubmit} style={{width:'100%'}}>
              
              <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.inputWrapper}>
                     <FaUser color={colors.iconColor} style={{marginRight:'10px'}}/>
                     <input name="username" value={formData.username} onChange={handleChange} style={styles.input} />
                  </div>
              </div>

              <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.inputWrapper}>
                     <FaPhone color={colors.iconColor} style={{marginRight:'10px'}}/>
                     <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91..." style={styles.input} />
                  </div>
              </div>

              <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password <small style={{color: colors.subText}}>(Optional)</small></label>
                  <div style={styles.inputWrapper}>
                     <FaLock color={colors.iconColor} style={{marginRight:'10px'}}/>
                     <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep same" style={styles.input} />
                  </div>
              </div>

              <button type="submit" style={styles.saveBtn}>
                 <FaSave /> Save Changes
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default Profile;