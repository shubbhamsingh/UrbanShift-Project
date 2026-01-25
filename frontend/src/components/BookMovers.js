import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookMovers = () => {
  const navigate = useNavigate();
  
  // 👇 FIX: Field names wahi rakhein jo Django Models me hain
  const [formData, setFormData] = useState({
    source: '',           // 'source_city' hata diya
    destination: '',      // 'destination_city' hata diya
    move_date: '',        // 'moving_date' hata diya
    move_size: '1BHK',    // 'house_size' hata diya
    items_list: ''        // 'items_description' hata diya
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
      // Endpoint '/move-requests/' hi rahega
      await axios.post(`${BACKEND_URL}/api/relocation/move-requests/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success("Request Sent! Check status in 'My Bookings' ✅");
      navigate('/my-moves'); 
    } catch (error) {
      console.error("Submission Error:", error.response?.data); // Error console me dikhega
      
      // Agar server specific error bataye (Jaise "Source is required")
      if (error.response && error.response.data) {
          const errorMsg = Object.values(error.response.data).flat().join(', ');
          toast.error(`Error: ${errorMsg}`);
      } else {
          toast.error("Failed to send request. Try again.");
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={{color: 'var(--text-primary)', textAlign:'center'}}>🚚 Book Packers & Movers</h2>
        <p style={{textAlign:'center', color:'var(--text-secondary)', marginBottom:'20px'}}>Get verified movers for a hassle-free shift.</p>
        
        <form onSubmit={handleSubmit}>
          
          <div style={inputGroup}>
            <label>Moving From (Source)</label>
            {/* name="source" kiya */}
            <input name="source" type="text" placeholder="e.g. Malviya Nagar, Jaipur" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Moving To (Destination)</label>
            {/* name="destination" kiya */}
            <input name="destination" type="text" placeholder="e.g. Whitefield, Bangalore" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={rowStyle}>
            <div style={{flex:1}}>
                <label>Move Date</label>
                {/* name="move_date" kiya */}
                <input name="move_date" type="date" onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{flex:1}}>
                <label>House Size</label>
                {/* name="move_size" kiya */}
                <select name="move_size" onChange={handleChange} style={inputStyle}>
                    <option>1BHK</option>
                    <option>2BHK</option>
                    <option>3BHK</option>
                    <option>Villa/Bungalow</option>
                    <option>Office</option>
                </select>
            </div>
          </div>

          <div style={inputGroup}>
            <label>List Major Items (Optional)</label>
            {/* name="items_list" kiya */}
            <textarea name="items_list" rows="3" placeholder="e.g. 1 Bed, 1 Fridge, 2 ACs..." onChange={handleChange} style={inputStyle}></textarea>
          </div>

          <button type="submit" style={btnStyle}>🚀 Send Request</button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px', display: 'flex', justifyContent: 'center', background: 'var(--bg-color)', minHeight:'90vh' };
const formCardStyle = { width: '100%', maxWidth: '500px', background: 'var(--card-bg)', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' };
const inputGroup = { marginBottom: '15px', display:'flex', flexDirection:'column', gap:'5px', color:'var(--text-primary)', fontWeight:'600' };
const rowStyle = { display:'flex', gap:'15px', marginBottom:'15px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' };
const btnStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight:'bold', marginTop:'10px' };

export default BookMovers;