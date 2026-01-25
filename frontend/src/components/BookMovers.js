import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookMovers = () => {
  const navigate = useNavigate();
  
  // 👇 1. State keys ko Django Model fields ke saath match kiya (Zaroori hai!)
  const [formData, setFormData] = useState({
    source_city: '',
    destination_city: '',
    moving_date: '',
    house_size: '1BHK',
    items_description: ''
  });

  // 👇 2. Smart URL Setup (Local aur Live dono ke liye)
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
      // 👇 3. Endpoint '/api/relocation/submit/' kar diya (urls.py ke hisab se)
      await axios.post(`${BACKEND_URL}/api/relocation/submit/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success("Request Sent! Check status in 'My Bookings' ✅");
      navigate('/my-moves'); // User ko ab seedha My Moves page par bhejo
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Try again.");
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
            {/* name="source" ko badal kar name="source_city" kiya */}
            <input name="source_city" type="text" placeholder="e.g. Malviya Nagar, Jaipur" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Moving To (Destination)</label>
            <input name="destination_city" type="text" placeholder="e.g. Whitefield, Bangalore" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={rowStyle}>
            <div style={{flex:1}}>
                <label>Move Date</label>
                <input name="moving_date" type="date" onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{flex:1}}>
                <label>House Size</label>
                <select name="house_size" onChange={handleChange} style={inputStyle}>
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
            <textarea name="items_description" rows="3" placeholder="e.g. 1 Bed, 1 Fridge, 2 ACs..." onChange={handleChange} style={inputStyle}></textarea>
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